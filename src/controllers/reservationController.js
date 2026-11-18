const { pool } = require('../config/db');

// Helper: Calculate nights between two dates
function calculateNights(inDateStr, outDateStr) {
  const inDate = new Date(inDateStr);
  const outDate = new Date(outDateStr);
  const diffTime = outDate.getTime() - inDate.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

// Helper: Luhn Checksum Validator for Credit Cards
function isValidLuhn(number) {
  const digits = String(number || '').replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

// Sequence 1: Make reservation and optionally pay online (with optional meal plans & add-on services)
async function createReservation(req, res) {
  const guestId = req.user.userId;
  const { roomId, checkInDate, checkOutDate, payOnline, cardInfo, addOns, mealPlan } = req.body;

  if (!roomId || !checkInDate || !checkOutDate) {
    return res.status(400).json({
      success: false,
      message: 'Room ID, check-in date, and check-out date are required.'
    });
  }

  const nights = calculateNights(checkInDate, checkOutDate);
  if (nights <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Check-out date must be at least one day after check-in date.'
    });
  }

  // Validate credit card if paying online immediately
  if (payOnline && cardInfo) {
    if (!isValidLuhn(cardInfo)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credit card number. Failed Luhn checksum validation.'
      });
    }
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1) Verify room exists and get price per night
    const [roomRows] = await connection.query('SELECT * FROM room WHERE room_id = ?', [roomId]);
    if (roomRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }
    const room = roomRows[0];

    // 2) Check if room is available for the given dates
    const [overlapRows] = await connection.query(
      `SELECT reservation_id 
       FROM reservation 
       WHERE room_id = ? 
         AND status IN ('Pending', 'Confirmed', 'Checked-In')
         AND check_in_date < ? 
         AND ? < check_out_date`,
      [roomId, checkOutDate, checkInDate]
    );

    if (overlapRows.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'Room is already booked for these dates. Please choose different dates or another room.'
      });
    }

    // 3) Calculate total room price
    const roomTotalPrice = Number((room.price_per_night * nights).toFixed(2));
    const initialStatus = payOnline ? 'Confirmed' : 'Pending';

    // 4) Insert reservation
    const [resResult] = await connection.query(
      `INSERT INTO reservation (guest_id, room_id, check_in_date, check_out_date, status, total_price)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [guestId, roomId, checkInDate, checkOutDate, initialStatus, roomTotalPrice]
    );
    const reservationId = resResult.insertId;

    // 5) Handle Add-ons & Meal plans as Room Service order (each add-on inserted individually so it can be cancelled individually)
    const selectedItemsList = [];
    let addOnsTotal = 0;

    if (mealPlan && mealPlan.name && Number(mealPlan.price) > 0) {
      const mealCost = Number(mealPlan.price) * (mealPlan.perNight ? nights : 1);
      addOnsTotal += mealCost;
      selectedItemsList.push(`${mealPlan.name} (EGP ${mealCost})`);
      await connection.query(
        `INSERT INTO room_service_order (reservation_id, items, total_price, status, ordered_at)
         VALUES (?, ?, ?, 'Placed', NOW())`,
        [reservationId, mealPlan.name, mealCost]
      );
    }

    if (Array.isArray(addOns) && addOns.length > 0) {
      for (const item of addOns) {
        const p = Number(item.price) || 0;
        if (p > 0 && item.name) {
          addOnsTotal += p;
          selectedItemsList.push(`${item.name} (EGP ${p})`);
          await connection.query(
            `INSERT INTO room_service_order (reservation_id, items, total_price, status, ordered_at)
             VALUES (?, ?, ?, 'Placed', NOW())`,
            [reservationId, item.name, p]
          );
        }
      }
    }

    const grandTotalPrice = Number((roomTotalPrice + addOnsTotal).toFixed(2));

    let paymentRecord = null;
    // 6) If guest chose to pay online immediately (Sequence 1 steps 9-15)
    if (payOnline) {
      const gatewayRef = 'GW-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
      const [payResult] = await connection.query(
        `INSERT INTO payment (reservation_id, amount, method, status, paid_at, gateway_ref)
         VALUES (?, ?, 'Online', 'Paid', NOW(), ?)`,
        [reservationId, grandTotalPrice, gatewayRef]
      );
      paymentRecord = {
        paymentId: payResult.insertId,
        amount: grandTotalPrice,
        method: 'Online',
        status: 'Paid',
        gatewayRef
      };
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: payOnline ? 'Reservation confirmed and payment completed.' : 'Reservation created (Pending payment).',
      reservation: {
        reservationId,
        guestId,
        roomId: room.room_id,
        roomNumber: room.room_number,
        roomType: room.type,
        checkInDate,
        checkOutDate,
        nights,
        roomTotalPrice,
        addOnsTotal,
        grandTotalPrice,
        selectedServices: selectedItemsList,
        status: initialStatus,
        payment: paymentRecord
      }
    });
  } catch (err) {
    await connection.rollback();
    console.error('createReservation error:', err);
    res.status(500).json({ success: false, message: 'Server error creating reservation.' });
  } finally {
    connection.release();
  }
}

// Sequence 5: Manage booking - View list of stays for the logged-in guest
async function getMyReservations(req, res) {
  const guestId = req.user.userId;
  try {
    const [rows] = await pool.query(
      `SELECT 
        r.reservation_id,
        r.guest_id,
        r.room_id,
        r.receptionist_id,
        DATE_FORMAT(r.check_in_date, '%Y-%m-%d') AS check_in_date,
        DATE_FORMAT(r.check_out_date, '%Y-%m-%d') AS check_out_date,
        r.status,
        r.total_price AS room_total,
        r.created_at,
        rm.room_number,
        rm.type AS room_type,
        rm.price_per_night,
        rm.status AS room_physical_status,
        COALESCE((SELECT SUM(o.total_price) FROM room_service_order o WHERE o.reservation_id = r.reservation_id AND o.status <> 'Cancelled'), 0) AS service_total,
        COALESCE((SELECT SUM(p.amount) FROM payment p WHERE p.reservation_id = r.reservation_id AND p.status = 'Paid'), 0) AS amount_paid
       FROM reservation r
       JOIN room rm ON rm.room_id = r.room_id
       WHERE r.guest_id = ?
       ORDER BY r.created_at DESC`,
      [guestId]
    );

    const stays = rows.map(r => {
      const grandTotal = Number((Number(r.room_total) + Number(r.service_total)).toFixed(2));
      const balance = Number((grandTotal - Number(r.amount_paid)).toFixed(2));
      return {
        ...r,
        grandTotal,
        balance: balance > 0 ? balance : 0
      };
    });

    res.json({ success: true, count: stays.length, stays });
  } catch (err) {
    console.error('getMyReservations error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving stays.' });
  }
}

// Get single reservation details by ID (Guest or Receptionist)
async function getReservationById(req, res) {
  const { id } = req.params;
  const user = req.user;

  try {
    const [rows] = await pool.query(
      `SELECT 
        r.reservation_id,
        r.guest_id,
        r.room_id,
        r.receptionist_id,
        DATE_FORMAT(r.check_in_date, '%Y-%m-%d') AS check_in_date,
        DATE_FORMAT(r.check_out_date, '%Y-%m-%d') AS check_out_date,
        r.status,
        r.total_price AS room_total,
        r.created_at,
        u.name AS guest_name,
        u.email AS guest_email,
        g.phone AS guest_phone,
        rm.room_number,
        rm.type AS room_type,
        rm.price_per_night,
        rm.status AS room_physical_status
       FROM reservation r
       JOIN \`user\` u ON u.user_id = r.guest_id
       JOIN guest g ON g.user_id = r.guest_id
       JOIN room rm ON rm.room_id = r.room_id
       WHERE r.reservation_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Reservation not found.' });
    }

    const stay = rows[0];

    // Authorization: Guest can only view their own reservation
    if (user.role === 'guest' && stay.guest_id !== user.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this reservation.' });
    }

    // Fetch payments
    const [payments] = await pool.query(
      'SELECT payment_id, amount, method, status, paid_at, gateway_ref FROM payment WHERE reservation_id = ? ORDER BY payment_id ASC',
      [id]
    );

    // Fetch room service orders
    const [orders] = await pool.query(
      'SELECT order_id, items, total_price, status, ordered_at FROM room_service_order WHERE reservation_id = ? ORDER BY order_id ASC',
      [id]
    );

    // Fetch review if any
    const [reviews] = await pool.query(
      'SELECT review_id, rating, comment, review_date FROM review WHERE reservation_id = ?',
      [id]
    );

    const roomTotal = Number(stay.room_total);
    const serviceTotal = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + Number(o.total_price), 0);
    const amountPaid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + Number(p.amount), 0);
    const grandTotal = Number((roomTotal + serviceTotal).toFixed(2));
    const balance = Number((grandTotal - amountPaid).toFixed(2));

    res.json({
      success: true,
      reservation: {
        ...stay,
        bill: {
          roomTotal,
          serviceTotal,
          amountPaid,
          grandTotal,
          balance: balance > 0 ? balance : 0
        },
        payments,
        orders,
        review: reviews[0] || null
      }
    });
  } catch (err) {
    console.error('getReservationById error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving reservation details.' });
  }
}

// Sequence 5: Manage booking - Cancel booking
async function cancelReservation(req, res) {
  const { id } = req.params;
  const user = req.user;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      'SELECT reservation_id, guest_id, room_id, status, total_price FROM reservation WHERE reservation_id = ?',
      [id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Reservation not found.' });
    }

    const reservation = rows[0];

    // Check ownership if guest
    if (user.role === 'guest' && reservation.guest_id !== user.userId) {
      await connection.rollback();
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this reservation.' });
    }

    if (reservation.status === 'Cancelled') {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Reservation is already cancelled.' });
    }

    if (reservation.status === 'Checked-Out' || reservation.status === 'Completed' || reservation.status === 'COMPLETED') {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Cannot cancel a completed/checked-out reservation.' });
    }

    // Step 6: cancel() - update status to Cancelled
    await connection.query("UPDATE reservation SET status = 'Cancelled' WHERE reservation_id = ?", [id]);

    // Step 7: updateStatus(AVAILABLE) on room
    await connection.query("UPDATE room SET status = 'Available' WHERE room_id = ?", [reservation.room_id]);

    // Opt: [booking was already paid] -> refund(paymentId)
    const [paidPayments] = await connection.query(
      "SELECT payment_id, amount FROM payment WHERE reservation_id = ? AND status = 'Paid'",
      [id]
    );

    let refundedTotal = 0;
    if (paidPayments.length > 0) {
      await connection.query(
        "UPDATE payment SET status = 'Refunded' WHERE reservation_id = ? AND status = 'Paid'",
        [id]
      );
      refundedTotal = paidPayments.reduce((acc, p) => acc + Number(p.amount), 0);
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Reservation cancelled successfully.',
      reservationId: Number(id),
      status: 'Cancelled',
      refundedAmount: refundedTotal
    });
  } catch (err) {
    await connection.rollback();
    console.error('cancelReservation error:', err);
    res.status(500).json({ success: false, message: 'Server error cancelling reservation.' });
  } finally {
    connection.release();
  }
}

// Sequence 5: Manage booking - Modify booking dates
async function modifyReservation(req, res) {
  const { id } = req.params;
  const user = req.user;
  const { newCheckInDate, newCheckOutDate } = req.body;

  if (!newCheckInDate || !newCheckOutDate) {
    return res.status(400).json({
      success: false,
      message: 'Both newCheckInDate and newCheckOutDate are required.'
    });
  }

  const nights = calculateNights(newCheckInDate, newCheckOutDate);
  if (nights <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Check-out date must be after check-in date.'
    });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [resRows] = await connection.query(
      'SELECT r.*, rm.price_per_night FROM reservation r JOIN room rm ON rm.room_id = r.room_id WHERE r.reservation_id = ?',
      [id]
    );

    if (resRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Reservation not found.' });
    }

    const reservation = resRows[0];

    // Check ownership if guest
    if (user.role === 'guest' && reservation.guest_id !== user.userId) {
      await connection.rollback();
      return res.status(403).json({ success: false, message: 'Unauthorized to modify this reservation.' });
    }

    if (reservation.status !== 'Pending' && reservation.status !== 'Confirmed') {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: `Cannot modify a reservation with status '${reservation.status}'.`
      });
    }

    // Step 12: isAvailable(newDates)
    const [overlapRows] = await connection.query(
      `SELECT reservation_id 
       FROM reservation 
       WHERE room_id = ? 
         AND reservation_id <> ?
         AND status IN ('Pending', 'Confirmed', 'Checked-In')
         AND check_in_date < ? 
         AND ? < check_out_date`,
      [reservation.room_id, id, newCheckOutDate, newCheckInDate]
    );

    if (overlapRows.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'The room is not available for the requested new dates.'
      });
    }

    // Step 15: recalculateTotalPrice()
    const newTotalPrice = Number((reservation.price_per_night * nights).toFixed(2));

    // Step 14: modify(newDates)
    await connection.query(
      'UPDATE reservation SET check_in_date = ?, check_out_date = ?, total_price = ? WHERE reservation_id = ?',
      [newCheckInDate, newCheckOutDate, newTotalPrice, id]
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'Reservation updated successfully.',
      reservation: {
        reservationId: Number(id),
        checkInDate: newCheckInDate,
        checkOutDate: newCheckOutDate,
        nights,
        totalPrice: newTotalPrice
      }
    });
  } catch (err) {
    await connection.rollback();
    console.error('modifyReservation error:', err);
    res.status(500).json({ success: false, message: 'Server error modifying reservation.' });
  } finally {
    connection.release();
  }
}

// Sequence 3: Check-in guest (Receptionist only)
async function checkInGuest(req, res) {
  const { id } = req.params;
  const receptionistId = req.user.userId;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Step 2 & 3: getReservation(reservationId)
    const [rows] = await connection.query(
      'SELECT reservation_id, room_id, status FROM reservation WHERE reservation_id = ?',
      [id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Error: Reservation not found.' });
    }

    const reservation = rows[0];

    // alt [reservation is CONFIRMED]
    if (reservation.status !== 'Confirmed') {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: `Error: cannot check in. Reservation status is '${reservation.status}', must be 'Confirmed'.`
      });
    }

    // Step 4: updateStatus(OCCUPIED) on room
    await connection.query("UPDATE room SET status = 'Occupied' WHERE room_id = ?", [reservation.room_id]);

    // Log room status update
    await connection.query(
      "INSERT INTO room_status_update (receptionist_id, room_id, new_status, updated_at) VALUES (?, ?, 'Occupied', NOW())",
      [receptionistId, reservation.room_id]
    );

    // Step 6: setStatus(CHECKED_IN) & assign receptionist
    await connection.query(
      "UPDATE reservation SET status = 'Checked-In', receptionist_id = ? WHERE reservation_id = ?",
      [receptionistId, id]
    );

    await connection.commit();

    // Step 7: check-in completed
    res.json({
      success: true,
      message: 'Check-in completed successfully. Room marked as Occupied.',
      reservationId: Number(id),
      status: 'Checked-In'
    });
  } catch (err) {
    await connection.rollback();
    console.error('checkInGuest error:', err);
    res.status(500).json({ success: false, message: 'Server error during check-in.' });
  } finally {
    connection.release();
  }
}

// Sequence 4: Check-out guest and process payment (Receptionist only)
// * Unifies status: sets status to 'Completed' (and compatible with 'Checked-Out')
async function checkOutGuest(req, res) {
  const { id } = req.params;
  const receptionistId = req.user.userId;
  const { paymentMethod, cardInfo } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [resRows] = await connection.query(
      `SELECT r.*, u.name AS guest_name, rm.room_number 
       FROM reservation r 
       JOIN \`user\` u ON u.user_id = r.guest_id
       JOIN room rm ON rm.room_id = r.room_id
       WHERE r.reservation_id = ?`,
      [id]
    );

    if (resRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Reservation not found.' });
    }

    const reservation = resRows[0];

    if (reservation.status !== 'Checked-In') {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: `Cannot check-out reservation with status '${reservation.status}'. Guest must be 'Checked-In'.`
      });
    }

    // Step 2 & 3: calculateBalance() / amount due
    const [orders] = await connection.query(
      "SELECT COALESCE(SUM(total_price), 0) AS service_total FROM room_service_order WHERE reservation_id = ? AND status <> 'Cancelled'",
      [id]
    );
    const [payments] = await connection.query(
      "SELECT COALESCE(SUM(amount), 0) AS paid_total FROM payment WHERE reservation_id = ? AND status = 'Paid'",
      [id]
    );

    const roomTotal = Number(reservation.total_price);
    const serviceTotal = Number(orders[0].service_total);
    const amountPaid = Number(payments[0].paid_total);
    const grandTotal = Number((roomTotal + serviceTotal).toFixed(2));
    const amountDue = Number((grandTotal - amountPaid).toFixed(2));

    let processedPayment = null;

    // Step 4-7: process(reservationId, amountDue) if balance due
    if (amountDue > 0) {
      const method = paymentMethod || 'Credit Card';
      const gatewayRef = 'GW-DESK-' + Date.now().toString(36).toUpperCase();

      const [payResult] = await connection.query(
        `INSERT INTO payment (reservation_id, amount, method, status, paid_at, gateway_ref)
         VALUES (?, ?, ?, 'Paid', NOW(), ?)`,
        [id, amountDue, method, gatewayRef]
      );

      processedPayment = {
        paymentId: payResult.insertId,
        amount: amountDue,
        method,
        status: 'Paid',
        gatewayRef
      };
    }

    // Step 8: updateStatus(AVAILABLE) or Dirty for housekeeping
    // We update room to 'Dirty' (ready for housekeeping) or 'Available' as per sequence
    await connection.query("UPDATE room SET status = 'Dirty' WHERE room_id = ?", [reservation.room_id]);
    await connection.query(
      "INSERT INTO room_status_update (receptionist_id, room_id, new_status, updated_at) VALUES (?, ?, 'Dirty', NOW())",
      [receptionistId, reservation.room_id]
    );

    // Step 9: setStatus(COMPLETED) -> UNIFIED with Checked-Out!
    await connection.query(
      "UPDATE reservation SET status = 'Completed', receptionist_id = ? WHERE reservation_id = ?",
      [receptionistId, id]
    );

    await connection.commit();

    // Step 10: invoice, check-out completed
    res.json({
      success: true,
      message: 'Check-out completed successfully and room marked for housekeeping.',
      reservationId: Number(id),
      status: 'Completed',
      invoice: {
        guestName: reservation.guest_name,
        roomNumber: reservation.room_number,
        checkInDate: reservation.check_in_date,
        checkOutDate: reservation.check_out_date,
        roomTotal,
        serviceTotal,
        grandTotal,
        previousPaid: amountPaid,
        finalPaid: amountDue,
        balanceDue: 0,
        processedPayment
      }
    });
  } catch (err) {
    await connection.rollback();
    console.error('checkOutGuest error:', err);
    res.status(500).json({ success: false, message: 'Server error during check-out.' });
  } finally {
    connection.release();
  }
}

// Front desk overview board (Receptionist only)
async function getDeskBoard(req, res) {
  try {
    const today = new Date().toISOString().slice(0, 10);

    // Arrivals today: Confirmed reservations whose check_in_date <= today
    const [arrivals] = await pool.query(
      `SELECT r.reservation_id, u.name AS guest_name, rm.room_number, rm.type,
              DATE_FORMAT(r.check_in_date, '%Y-%m-%d') AS check_in_date,
              DATE_FORMAT(r.check_out_date, '%Y-%m-%d') AS check_out_date,
              r.status, r.total_price,
              COALESCE((SELECT SUM(p.amount) FROM payment p WHERE p.reservation_id = r.reservation_id AND p.status = 'Paid'), 0) AS amount_paid
       FROM reservation r
       JOIN \`user\` u ON u.user_id = r.guest_id
       JOIN room rm ON rm.room_id = r.room_id
       WHERE r.status = 'Confirmed' AND r.check_in_date <= ?
       ORDER BY r.check_in_date ASC`,
      [today]
    );

    // In the house: Checked-In guests
    const [inHouse] = await pool.query(
      `SELECT r.reservation_id, u.name AS guest_name, rm.room_number, rm.type,
              DATE_FORMAT(r.check_in_date, '%Y-%m-%d') AS check_in_date,
              DATE_FORMAT(r.check_out_date, '%Y-%m-%d') AS check_out_date,
              r.status, r.total_price,
              COALESCE((SELECT SUM(o.total_price) FROM room_service_order o WHERE o.reservation_id = r.reservation_id AND o.status <> 'Cancelled'), 0) AS service_total,
              COALESCE((SELECT SUM(p.amount) FROM payment p WHERE p.reservation_id = r.reservation_id AND p.status = 'Paid'), 0) AS amount_paid
       FROM reservation r
       JOIN \`user\` u ON u.user_id = r.guest_id
       JOIN room rm ON rm.room_id = r.room_id
       WHERE r.status = 'Checked-In'
       ORDER BY r.check_out_date ASC`
    );

    // Upcoming confirmed reservations
    const [upcoming] = await pool.query(
      `SELECT r.reservation_id, u.name AS guest_name, rm.room_number, rm.type,
              DATE_FORMAT(r.check_in_date, '%Y-%m-%d') AS check_in_date,
              DATE_FORMAT(r.check_out_date, '%Y-%m-%d') AS check_out_date,
              r.status, r.total_price,
              COALESCE((SELECT SUM(p.amount) FROM payment p WHERE p.reservation_id = r.reservation_id AND p.status = 'Paid'), 0) AS amount_paid
       FROM reservation r
       JOIN \`user\` u ON u.user_id = r.guest_id
       JOIN room rm ON rm.room_id = r.room_id
       WHERE r.status = 'Confirmed' AND r.check_in_date > ?
       ORDER BY r.check_in_date ASC`,
      [today]
    );

    res.json({
      success: true,
      board: {
        arrivals,
        inHouse,
        upcoming
      }
    });
  } catch (err) {
    console.error('getDeskBoard error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving desk board.' });
  }
}

module.exports = {
  createReservation,
  getMyReservations,
  getReservationById,
  cancelReservation,
  modifyReservation,
  checkInGuest,
  checkOutGuest,
  getDeskBoard
};
