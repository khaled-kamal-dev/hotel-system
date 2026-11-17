const { pool } = require('../config/db');

// Helper: Luhn Algorithm validator for Credit Cards
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

// Process a payment for a reservation (Online by guest or at desk by receptionist)
async function processPayment(req, res) {
  const { reservationId, amount, method, cardInfo } = req.body;
  const user = req.user;

  if (!reservationId || !amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Valid reservation ID and positive amount are required.' });
  }

  // Validate card if paying online or with credit card
  if (cardInfo && (method === 'Online' || method === 'Credit Card')) {
    if (!isValidLuhn(cardInfo)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credit card number. Failed Luhn checksum validation.'
      });
    }
  }

  const allowedMethods = ['Cash', 'Credit Card', 'Online'];
  const paymentMethod = method && allowedMethods.includes(method) ? method : (user.role === 'guest' ? 'Online' : 'Credit Card');

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [resRows] = await connection.query(
      'SELECT reservation_id, guest_id, status FROM reservation WHERE reservation_id = ?',
      [reservationId]
    );

    if (resRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Reservation not found.' });
    }

    const reservation = resRows[0];

    // Check ownership if guest
    if (user.role === 'guest' && reservation.guest_id !== user.userId) {
      await connection.rollback();
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    // Optional simulated payment failure test (e.g. card ending in 0000)
    if (cardInfo && String(cardInfo).endsWith('0000')) {
      const gatewayRef = 'GW-FAIL-' + Date.now().toString(36).toUpperCase();
      await connection.query(
        'INSERT INTO payment (reservation_id, amount, method, status, paid_at, gateway_ref) VALUES (?, ?, ?, ?, NOW(), ?)',
        [reservationId, amount, paymentMethod, 'Failed', gatewayRef]
      );
      await connection.commit();
      return res.status(400).json({
        success: false,
        message: 'Payment declined by bank gateway. Please check your card details.'
      });
    }

    const gatewayRef = 'GW-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);

    const [payResult] = await connection.query(
      'INSERT INTO payment (reservation_id, amount, method, status, paid_at, gateway_ref) VALUES (?, ?, ?, ?, NOW(), ?)',
      [reservationId, amount, paymentMethod, 'Paid', gatewayRef]
    );

    // If reservation is still Pending, confirm it
    if (reservation.status === 'Pending') {
      await connection.query("UPDATE reservation SET status = 'Confirmed' WHERE reservation_id = ?", [reservationId]);
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Payment processed successfully.',
      payment: {
        paymentId: payResult.insertId,
        reservationId: Number(reservationId),
        amount: Number(amount),
        method: paymentMethod,
        status: 'Paid',
        gatewayRef
      }
    });
  } catch (err) {
    await connection.rollback();
    console.error('processPayment error:', err);
    res.status(500).json({ success: false, message: 'Server error processing payment.' });
  } finally {
    connection.release();
  }
}

// Get payments for a reservation
async function getPaymentsByReservation(req, res) {
  const { reservationId } = req.params;
  try {
    const [payments] = await pool.query(
      'SELECT * FROM payment WHERE reservation_id = ? ORDER BY paid_at DESC',
      [reservationId]
    );
    res.json({ success: true, count: payments.length, payments });
  } catch (err) {
    console.error('getPaymentsByReservation error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving payments.' });
  }
}

module.exports = {
  processPayment,
  getPaymentsByReservation
};
