(function () {
  "use strict";

  var KEY = "nile-house-db-v1";
  var SESSION = "nile-house-session";
  var ACTIVE = ["Pending", "Confirmed", "Checked-In"];
  var MENU = [
    { name: "Mint tea", price: 30 },
    { name: "Still water", price: 20 },
    { name: "Orange juice", price: 40 },
    { name: "Club sandwich", price: 120 },
    { name: "Grill platter", price: 220 }
  ];

  var db = load() || seed();
  save();

  function hashPassword(pw) {
    var h = 5381;
    var s = String(pw);
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
    return "h$" + (h >>> 0).toString(16);
  }

  function money(n) {
    return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function dateISO(d) {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function startOfToday() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function todayISO() {
    return dateISO(startOfToday());
  }

  function shiftDate(days) {
    var d = startOfToday();
    d.setDate(d.getDate() + days);
    return dateISO(d);
  }

  function nowStamp() {
    var d = new Date();
    return dateISO(d) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
  }

  function nights(checkIn, checkOut) {
    var a = Date.parse(checkIn + "T00:00:00Z");
    var b = Date.parse(checkOut + "T00:00:00Z");
    return Math.round((b - a) / 86400000);
  }

  function nextId(list, key) {
    return list.reduce(function (max, row) {
      return Math.max(max, row[key]);
    }, 0) + 1;
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(db));
  }

  function seed() {
    var demo = hashPassword("demo123");
    var staff = hashPassword("staff123");
    return {
      users: [
        { user_id: 1, name: "Omar Hassan", email: "omar@example.com", password_hash: demo },
        { user_id: 2, name: "Sara Ali", email: "sara@example.com", password_hash: demo },
        { user_id: 4, name: "Mona Adel", email: "mona@example.com", password_hash: demo },
        { user_id: 3, name: "Ahmed Samir", email: "ahmed@hotel.com", password_hash: staff }
      ],
      guests: [
        { user_id: 1, phone: "01001234567" },
        { user_id: 2, phone: "01111234567" },
        { user_id: 4, phone: "01221234567" }
      ],
      receptionists: [
        { user_id: 3, employee_id: 1001, shift: "Morning" }
      ],
      rooms: [
        { room_id: 1, room_number: "101", type: "Single", price_per_night: 250, status: "Dirty" },
        { room_id: 2, room_number: "102", type: "Double", price_per_night: 400, status: "Available" },
        { room_id: 3, room_number: "201", type: "Suite", price_per_night: 900, status: "Available" },
        { room_id: 4, room_number: "103", type: "Double", price_per_night: 450, status: "Occupied" },
        { room_id: 5, room_number: "104", type: "Single", price_per_night: 250, status: "Available" },
        { room_id: 6, room_number: "202", type: "Suite", price_per_night: 1100, status: "Available" },
        { room_id: 7, room_number: "105", type: "Double", price_per_night: 480, status: "Dirty" }
      ],
      reservations: [
        { reservation_id: 1, guest_id: 1, room_id: 1, receptionist_id: 3, check_in_date: shiftDate(-12), check_out_date: shiftDate(-9), status: "Checked-Out", total_price: 750 },
        { reservation_id: 2, guest_id: 2, room_id: 2, receptionist_id: null, check_in_date: shiftDate(0), check_out_date: shiftDate(2), status: "Confirmed", total_price: 800 },
        { reservation_id: 3, guest_id: 4, room_id: 4, receptionist_id: 3, check_in_date: shiftDate(-1), check_out_date: shiftDate(2), status: "Checked-In", total_price: 1350 },
        { reservation_id: 4, guest_id: 1, room_id: 3, receptionist_id: null, check_in_date: shiftDate(7), check_out_date: shiftDate(10), status: "Pending", total_price: 2700 }
      ],
      payments: [
        { payment_id: 1, reservation_id: 1, amount: 750, method: "Credit Card", status: "Paid", paid_at: shiftDate(-9) + " 11:00:00", gateway_ref: "pi_seed_1" },
        { payment_id: 2, reservation_id: 2, amount: 800, method: "Online", status: "Paid", paid_at: shiftDate(-1) + " 18:20:00", gateway_ref: "pi_seed_2" },
        { payment_id: 3, reservation_id: 3, amount: 1000, method: "Credit Card", status: "Paid", paid_at: shiftDate(-1) + " 15:00:00", gateway_ref: "pi_seed_3" }
      ],
      room_service_orders: [
        { order_id: 1, reservation_id: 3, items: "Mint tea x1, Club sandwich x1", total_price: 150, status: "Delivered", ordered_at: shiftDate(-1) + " 20:15:00" }
      ],
      reviews: [
        { review_id: 1, reservation_id: 1, guest_id: 1, rating: 5, comment: "Great stay, very clean room.", review_date: shiftDate(-9) }
      ],
      room_status_updates: [
        { update_id: 1, receptionist_id: 3, room_id: 1, new_status: "Dirty", updated_at: shiftDate(-9) + " 12:05:00" },
        { update_id: 2, receptionist_id: 3, room_id: 4, new_status: "Occupied", updated_at: shiftDate(-1) + " 15:10:00" }
      ],
      chat_sessions: [],
      chat_messages: []
    };
  }

  function userByEmail(email) {
    var needle = String(email || "").trim().toLowerCase();
    return db.users.find(function (user) { return user.email === needle; }) || null;
  }

  function profile(user) {
    if (!user) return null;
    var guest = db.guests.find(function (row) { return row.user_id === user.user_id; });
    var receptionist = db.receptionists.find(function (row) { return row.user_id === user.user_id; });
    return {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: receptionist ? "receptionist" : "guest",
      phone: guest ? guest.phone : null,
      employee_id: receptionist ? receptionist.employee_id : null,
      shift: receptionist ? receptionist.shift : null
    };
  }

  function current() {
    try {
      var raw = localStorage.getItem(SESSION);
      var session = raw ? JSON.parse(raw) : null;
      if (!session) return null;
      var user = db.users.find(function (row) { return row.user_id === session.user_id; });
      return profile(user);
    } catch (err) {
      return null;
    }
  }

  function setSession(userId) {
    localStorage.setItem(SESSION, JSON.stringify({ user_id: userId }));
  }

  function roomById(id) {
    return db.rooms.find(function (room) { return room.room_id === Number(id); }) || null;
  }

  function reservationById(id) {
    return db.reservations.find(function (row) { return row.reservation_id === Number(id); }) || null;
  }

  function validateRange(checkIn, checkOut) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn || "") || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut || "")) {
      return "Choose a check-in and a check-out date.";
    }
    if (!(checkOut > checkIn)) return "Check-out has to be after check-in.";
    if (checkIn < todayISO()) return "Check-in can't be in the past.";
    return "";
  }

  function overlaps(checkIn, checkOut, other) {
    return other.check_in_date < checkOut && checkIn < other.check_out_date;
  }

  function isFree(roomId, checkIn, checkOut, excludeId) {
    return !db.reservations.some(function (row) {
      return row.room_id === roomId &&
        row.reservation_id !== excludeId &&
        ACTIVE.indexOf(row.status) !== -1 &&
        overlaps(checkIn, checkOut, row);
    });
  }

  function sumPaid(reservationId) {
    return money(db.payments.reduce(function (sum, payment) {
      if (payment.reservation_id === reservationId && payment.status === "Paid") return sum + Number(payment.amount);
      return sum;
    }, 0));
  }

  function serviceTotal(reservationId) {
    return money(db.room_service_orders.reduce(function (sum, order) {
      if (order.reservation_id === reservationId && order.status !== "Cancelled") return sum + Number(order.total_price);
      return sum;
    }, 0));
  }

  function billFor(reservation) {
    var roomTotal = money(reservation.total_price);
    var service = serviceTotal(reservation.reservation_id);
    var paid = sumPaid(reservation.reservation_id);
    var grand = money(roomTotal + service);
    return {
      room_total: roomTotal,
      room_service_total: service,
      amount_paid: paid,
      grand_total: grand,
      balance_due: money(grand - paid)
    };
  }

  function guestOf(reservation) {
    var user = db.users.find(function (row) { return row.user_id === reservation.guest_id; });
    var guest = db.guests.find(function (row) { return row.user_id === reservation.guest_id; });
    return {
      user_id: reservation.guest_id,
      name: user ? user.name : "Guest",
      email: user ? user.email : "",
      phone: guest ? guest.phone : ""
    };
  }

  function ownReservation(guestId, reservationId) {
    var reservation = reservationById(reservationId);
    if (!reservation) return { error: "Booking not found." };
    if (reservation.guest_id !== guestId) return { error: "This booking belongs to another guest." };
    return { reservation: reservation };
  }

  function logStatus(receptionistId, roomId, status) {
    db.room_status_updates.push({
      update_id: nextId(db.room_status_updates, "update_id"),
      receptionist_id: receptionistId,
      room_id: roomId,
      new_status: status,
      updated_at: nowStamp()
    });
  }

  function refundDownTo(reservationId, newTotal) {
    var paid = sumPaid(reservationId);
    var need = money(paid - newTotal);
    if (need <= 0) return;
    var rows = db.payments.filter(function (payment) {
      return payment.reservation_id === reservationId && payment.status === "Paid";
    });
    for (var i = rows.length - 1; i >= 0 && need > 0; i--) {
      var payment = rows[i];
      if (payment.amount <= need + 0.001) {
        need = money(need - payment.amount);
        payment.status = "Refunded";
      } else {
        var refunded = need;
        payment.amount = money(payment.amount - need);
        db.payments.push({
          payment_id: nextId(db.payments, "payment_id"),
          reservation_id: reservationId,
          amount: refunded,
          method: payment.method,
          status: "Refunded",
          paid_at: nowStamp(),
          gateway_ref: "re_" + Date.now().toString(36)
        });
        need = 0;
      }
    }
  }

  function chargeCard(cardNumber) {
    var digits = String(cardNumber || "").replace(/\s+/g, "");
    if (!/^\d{12,19}$/.test(digits)) {
      return { ok: false, error: "Enter a card number of 12 to 19 digits." };
    }
    if (digits.slice(-4) === "0000") {
      return { ok: false, declined: true, error: "The payment gateway declined this card." };
    }
    return { ok: true, ref: "pi_" + Date.now().toString(36), last4: digits.slice(-4) };
  }

  function ensureChat(guestId) {
    var open = db.chat_sessions.find(function (session) {
      return session.guest_id === guestId && session.status === "Open";
    });
    if (open) return open;
    var session = {
      session_id: nextId(db.chat_sessions, "session_id"),
      guest_id: guestId,
      receptionist_id: null,
      escalated: false,
      status: "Open",
      created_at: nowStamp()
    };
    db.chat_sessions.push(session);
    return session;
  }

  function postChat(session, sender, body) {
    db.chat_messages.push({
      message_id: nextId(db.chat_messages, "message_id"),
      session_id: session.session_id,
      sender: sender,
      body: body,
      created_at: nowStamp()
    });
  }

  function botReply(guestId, text) {
    var q = text.toLowerCase();
    if (/(receptionist|human|person|staff|agent|موظف|استقبال)/.test(q)) return null;
    if (/(hello|hi|hey|good morning|good evening|السلام|ازيك|ازيك|مرحبا)/.test(q)) {
      return "Hello. I can tell you room prices, read your own bookings, and explain check-in, check-out, and cancellation.";
    }
    if (/(price|prices|cost|rate|how much|سعر)/.test(q)) {
      return db.rooms.map(function (room) {
        return "Room " + room.room_number + " · " + room.type + " · EGP " + room.price_per_night + " a night";
      }).join("\n");
    }
    if (/(check-?out|checkout)/.test(q)) {
      return "Check-out is done at the desk. The bill is the room total plus room service, minus payments that are already paid.";
    }
    if (/(check-?in|check in|arrival)/.test(q)) {
      return "Check-in happens at the desk on the arrival date, after the booking is confirmed.";
    }
    if (/(cancel)/.test(q)) {
      return "A pending or confirmed booking can be cancelled from My stays. Paid amounts are marked refunded. A checked-in stay stays with the desk.";
    }
    if (/(room|suite|single|double|غرفة|غرف)/.test(q)) {
      return "Nile House has Single, Double, and Suite rooms. Search with your dates. A room is free when no pending, confirmed, or checked-in stay covers those nights.";
    }
    if (/(booking|reservation|my stay|حجز)/.test(q)) {
      var rows = db.reservations.filter(function (row) { return row.guest_id === guestId; });
      if (!rows.length) return "You don't have a booking yet.";
      return rows.map(function (row) {
        var room = roomById(row.room_id);
        return "Booking " + row.reservation_id + ": room " + room.room_number + ", " + row.check_in_date + " to " + row.check_out_date + ", " + row.status + ", EGP " + row.total_price + ".";
      }).join("\n");
    }
    return null;
  }

  function login(email, password) {
    var user = userByEmail(email);
    if (!user || user.password_hash !== hashPassword(password || "")) {
      return { ok: false, error: "Email or password is wrong." };
    }
    setSession(user.user_id);
    return { ok: true, user: profile(user) };
  }

  function logout() {
    localStorage.removeItem(SESSION);
  }

  function register(fields) {
    var name = String(fields.name || "").trim();
    var email = String(fields.email || "").trim().toLowerCase();
    var phone = String(fields.phone || "").trim();
    var password = String(fields.password || "");
    if (!name || !email || !phone || !password) return { ok: false, error: "Fill in name, email, phone, and password." };
    if (name.length > 100) return { ok: false, error: "Name is too long." };
    if (email.length > 150 || email.indexOf("@") === -1) return { ok: false, error: "Enter a valid email." };
    if (phone.length > 20) return { ok: false, error: "Phone must be 20 characters or fewer." };
    if (password.length < 6) return { ok: false, error: "Use at least 6 characters for the password." };
    if (userByEmail(email)) return { ok: false, error: "An account with this email already exists." };
    var user = {
      user_id: nextId(db.users, "user_id"),
      name: name,
      email: email,
      password_hash: hashPassword(password)
    };
    db.users.push(user);
    db.guests.push({ user_id: user.user_id, phone: phone });
    save();
    setSession(user.user_id);
    return { ok: true, user: profile(user) };
  }

  function searchRooms(checkIn, checkOut, type) {
    var error = validateRange(checkIn, checkOut);
    if (error) return { ok: false, error: error };
    var stay = nights(checkIn, checkOut);
    var rooms = db.rooms.filter(function (room) {
      return !type || type === "Any" || room.type === type;
    }).map(function (room) {
      var free = isFree(room.room_id, checkIn, checkOut);
      return {
        room_id: room.room_id,
        room_number: room.room_number,
        type: room.type,
        price_per_night: room.price_per_night,
        status: room.status,
        free: free,
        nights: stay,
        total: money(stay * room.price_per_night)
      };
    });
    return { ok: true, rooms: rooms, nights: stay };
  }

  function makeReservation(guestId, roomId, checkIn, checkOut) {
    if (!db.guests.some(function (guest) { return guest.user_id === guestId; })) {
      return { ok: false, error: "Sign in as a guest to book." };
    }
    var error = validateRange(checkIn, checkOut);
    if (error) return { ok: false, error: error };
    var room = roomById(roomId);
    if (!room) return { ok: false, error: "Room not found." };
    if (!isFree(room.room_id, checkIn, checkOut)) {
      return { ok: false, error: "This room is already held for those dates." };
    }
    var reservation = {
      reservation_id: nextId(db.reservations, "reservation_id"),
      guest_id: guestId,
      room_id: room.room_id,
      receptionist_id: null,
      check_in_date: checkIn,
      check_out_date: checkOut,
      status: "Pending",
      total_price: money(nights(checkIn, checkOut) * room.price_per_night)
    };
    db.reservations.push(reservation);
    save();
    return { ok: true, reservation: reservation };
  }

  function payOnline(guestId, reservationId, card) {
    var owned = ownReservation(guestId, reservationId);
    if (owned.error) return { ok: false, error: owned.error };
    var reservation = owned.reservation;
    if (ACTIVE.indexOf(reservation.status) === -1 || reservation.status === "Checked-In") {
      return { ok: false, error: "This booking can't be paid online." };
    }
    var due = billFor(reservation).balance_due;
    if (due <= 0) return { ok: false, error: "Nothing is due on this booking." };
    if (!String(card.cardName || "").trim()) return { ok: false, error: "Enter the name on the card." };
    var charge = chargeCard(card.cardNumber);
    var payment = {
      payment_id: nextId(db.payments, "payment_id"),
      reservation_id: reservation.reservation_id,
      amount: due,
      method: "Online",
      status: charge.ok ? "Paid" : "Failed",
      paid_at: charge.ok ? nowStamp() : null,
      gateway_ref: charge.ok ? charge.ref : "fail_" + Date.now().toString(36)
    };
    db.payments.push(payment);
    if (charge.ok && reservation.status === "Pending") reservation.status = "Confirmed";
    save();
    if (!charge.ok) return { ok: false, error: charge.error + " The booking is still " + reservation.status.toLowerCase() + "." };
    return { ok: true, gateway_ref: charge.ref, last4: charge.last4, amount: due, status: reservation.status };
  }

  function cancelBooking(guestId, reservationId) {
    var owned = ownReservation(guestId, reservationId);
    if (owned.error) return { ok: false, error: owned.error };
    var reservation = owned.reservation;
    if (["Pending", "Confirmed"].indexOf(reservation.status) === -1) {
      return { ok: false, error: "Only a pending or confirmed booking can be cancelled." };
    }
    var refunded = 0;
    db.payments.forEach(function (payment) {
      if (payment.reservation_id === reservation.reservation_id && payment.status === "Paid") {
        payment.status = "Refunded";
        refunded = money(refunded + Number(payment.amount));
      }
    });
    reservation.status = "Cancelled";
    save();
    return { ok: true, refunded: refunded };
  }

  function modifyBooking(guestId, reservationId, checkIn, checkOut) {
    var owned = ownReservation(guestId, reservationId);
    if (owned.error) return { ok: false, error: owned.error };
    var reservation = owned.reservation;
    if (["Pending", "Confirmed"].indexOf(reservation.status) === -1) {
      return { ok: false, error: "Only a pending or confirmed booking can be changed." };
    }
    var error = validateRange(checkIn, checkOut);
    if (error) return { ok: false, error: error };
    if (!isFree(reservation.room_id, checkIn, checkOut, reservation.reservation_id)) {
      return { ok: false, error: "This room is already held for those dates." };
    }
    var room = roomById(reservation.room_id);
    var newTotal = money(nights(checkIn, checkOut) * room.price_per_night);
    refundDownTo(reservation.reservation_id, newTotal);
    reservation.check_in_date = checkIn;
    reservation.check_out_date = checkOut;
    reservation.total_price = newTotal;
    save();
    return { ok: true, balance_due: billFor(reservation).balance_due };
  }

  function orderRoomService(guestId, reservationId, qtyMap) {
    var owned = ownReservation(guestId, reservationId);
    if (owned.error) return { ok: false, error: owned.error };
    if (owned.reservation.status !== "Checked-In") {
      return { ok: false, error: "Room service is available after check-in." };
    }
    var parts = [];
    var total = 0;
    MENU.forEach(function (item) {
      var qty = Number(qtyMap[item.name] || 0);
      if (!qty) return;
      if (!Number.isInteger(qty) || qty < 0 || qty > 10) {
        parts.push(null);
        return;
      }
      parts.push(item.name + " x" + qty);
      total += item.price * qty;
    });
    if (parts.indexOf(null) !== -1) return { ok: false, error: "Quantity has to be a whole number from 0 to 10." };
    parts = parts.filter(Boolean);
    if (!parts.length) return { ok: false, error: "Choose at least one item." };
    var order = {
      order_id: nextId(db.room_service_orders, "order_id"),
      reservation_id: Number(reservationId),
      items: parts.join(", "),
      total_price: money(total),
      status: "Placed",
      ordered_at: nowStamp()
    };
    db.room_service_orders.push(order);
    save();
    return { ok: true, order: order };
  }

  function cancelRoomService(guestId, orderId) {
    var order = db.room_service_orders.find(function (row) { return row.order_id === Number(orderId); });
    if (!order) return { ok: false, error: "Order not found." };
    var owned = ownReservation(guestId, order.reservation_id);
    if (owned.error) return { ok: false, error: owned.error };
    if (order.status !== "Placed") return { ok: false, error: "Only a placed order can be cancelled." };
    order.status = "Cancelled";
    save();
    return { ok: true };
  }

  function leaveReview(guestId, reservationId, rating, comment) {
    var owned = ownReservation(guestId, reservationId);
    if (owned.error) return { ok: false, error: owned.error };
    if (owned.reservation.status !== "Checked-Out") {
      return { ok: false, error: "A review can be left after check-out." };
    }
    if (db.reviews.some(function (review) { return review.reservation_id === Number(reservationId); })) {
      return { ok: false, error: "This stay already has a review." };
    }
    var score = Number(rating);
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      return { ok: false, error: "Choose a rating from 1 to 5." };
    }
    db.reviews.push({
      review_id: nextId(db.reviews, "review_id"),
      reservation_id: Number(reservationId),
      guest_id: owned.reservation.guest_id,
      rating: score,
      comment: String(comment || "").trim(),
      review_date: todayISO()
    });
    save();
    return { ok: true };
  }

  function checkInGuest(receptionistId, reservationId) {
    var reservation = reservationById(reservationId);
    if (!reservation) return { ok: false, error: "Booking not found." };
    if (reservation.status !== "Confirmed") return { ok: false, error: "Only a confirmed booking can be checked in." };
    var today = todayISO();
    if (today < reservation.check_in_date) return { ok: false, error: "Check-in opens on the arrival date." };
    if (today >= reservation.check_out_date) return { ok: false, error: "This booking has already ended." };
    var room = roomById(reservation.room_id);
    reservation.status = "Checked-In";
    reservation.receptionist_id = receptionistId;
    room.status = "Occupied";
    logStatus(receptionistId, room.room_id, "Occupied");
    save();
    return { ok: true };
  }

  function checkOutGuest(receptionistId, reservationId, payment) {
    var reservation = reservationById(reservationId);
    if (!reservation) return { ok: false, error: "Booking not found." };
    if (reservation.status !== "Checked-In") return { ok: false, error: "Only a checked-in guest can check out." };
    var due = billFor(reservation).balance_due;
    var method = payment.method || "Cash";
    if (due > 0) {
      if (["Cash", "Credit Card"].indexOf(method) === -1) return { ok: false, error: "Choose cash or card." };
      var ref = null;
      if (method === "Credit Card") {
        var charge = chargeCard(payment.cardNumber);
        if (!charge.ok) {
          db.payments.push({
            payment_id: nextId(db.payments, "payment_id"),
            reservation_id: reservation.reservation_id,
            amount: due,
            method: "Credit Card",
            status: "Failed",
            paid_at: null,
            gateway_ref: "fail_" + Date.now().toString(36)
          });
          save();
          return { ok: false, error: charge.error + " The guest is still checked in." };
        }
        ref = charge.ref;
      }
      db.payments.push({
        payment_id: nextId(db.payments, "payment_id"),
        reservation_id: reservation.reservation_id,
        amount: due,
        method: method,
        status: "Paid",
        paid_at: nowStamp(),
        gateway_ref: ref
      });
    }
    reservation.status = "Checked-Out";
    if (!reservation.receptionist_id) reservation.receptionist_id = receptionistId;
    var room = roomById(reservation.room_id);
    room.status = "Dirty";
    logStatus(receptionistId, room.room_id, "Dirty");
    save();
    return { ok: true, balance_was: due };
  }

  function updateRoomStatus(receptionistId, roomId, status) {
    if (["Available", "Occupied", "Dirty"].indexOf(status) === -1) {
      return { ok: false, error: "Unknown room status." };
    }
    var room = roomById(roomId);
    if (!room) return { ok: false, error: "Room not found." };
    if (room.status === status) return { ok: true };
    if (status === "Available") {
      var today = todayISO();
      var inHouse = db.reservations.some(function (row) {
        return row.room_id === room.room_id && row.status === "Checked-In" && row.check_in_date <= today && today < row.check_out_date;
      });
      if (inHouse) return { ok: false, error: "A guest is still checked into room " + room.room_number + "." };
    }
    room.status = status;
    logStatus(receptionistId, room.room_id, status);
    save();
    return { ok: true };
  }

  function markDelivered(orderId) {
    var order = db.room_service_orders.find(function (row) { return row.order_id === Number(orderId); });
    if (!order) return { ok: false, error: "Order not found." };
    if (order.status !== "Placed") return { ok: false, error: "This order is already " + order.status.toLowerCase() + "." };
    order.status = "Delivered";
    save();
    return { ok: true };
  }

  function sendChat(guestId, text) {
    var body = String(text || "").trim();
    if (!body) return { ok: false, error: "Write a message first." };
    if (!db.guests.some(function (guest) { return guest.user_id === guestId; })) {
      return { ok: false, error: "Sign in as a guest to use the assistant." };
    }
    var session = ensureChat(guestId);
    postChat(session, "Guest", body);
    if (!session.escalated) {
      var answer = botReply(guestId, body);
      if (answer == null) {
        session.escalated = true;
        postChat(session, "Bot", "I can't answer that from the hotel records. Transferring you to a receptionist.");
      } else {
        postChat(session, "Bot", answer);
      }
    }
    save();
    return { ok: true };
  }

  function escalateChat(guestId) {
    var session = ensureChat(guestId);
    if (!session.escalated) {
      session.escalated = true;
      postChat(session, "Bot", "Transferring you to a receptionist.");
      save();
    }
    return { ok: true };
  }

  function replyToChat(receptionistId, sessionId, text) {
    var body = String(text || "").trim();
    if (!body) return { ok: false, error: "Write a reply first." };
    var session = db.chat_sessions.find(function (row) { return row.session_id === Number(sessionId); });
    if (!session) return { ok: false, error: "Chat not found." };
    if (!session.escalated) return { ok: false, error: "This chat has not been transferred." };
    if (session.status !== "Open") return { ok: false, error: "This chat is closed." };
    session.receptionist_id = receptionistId;
    postChat(session, "Receptionist", body);
    save();
    return { ok: true };
  }

  function endChat(receptionistId, sessionId) {
    var session = db.chat_sessions.find(function (row) { return row.session_id === Number(sessionId); });
    if (!session) return { ok: false, error: "Chat not found." };
    if (session.status === "Closed") return { ok: true };
    session.status = "Closed";
    session.receptionist_id = session.receptionist_id || receptionistId;
    postChat(session, "Receptionist", "This chat is closed. Send a new message if you need the assistant again.");
    save();
    return { ok: true };
  }

  function messagesFor(sessionId) {
    return db.chat_messages.filter(function (message) {
      return message.session_id === Number(sessionId);
    });
  }

  function booking(id) {
    var reservation = reservationById(id);
    if (!reservation) return null;
    var room = roomById(reservation.room_id);
    return {
      reservation: reservation,
      room: room,
      guest: guestOf(reservation),
      bill: billFor(reservation),
      payments: db.payments.filter(function (payment) { return payment.reservation_id === reservation.reservation_id; }),
      orders: db.room_service_orders.filter(function (order) { return order.reservation_id === reservation.reservation_id; }),
      review: db.reviews.find(function (review) { return review.reservation_id === reservation.reservation_id; }) || null
    };
  }

  function myStays(guestId) {
    return db.reservations.filter(function (row) {
      return row.guest_id === guestId;
    }).sort(function (a, b) {
      return a.check_in_date < b.check_in_date ? 1 : -1;
    }).map(function (row) {
      return booking(row.reservation_id);
    });
  }

  function guestChat(guestId) {
    var session = null;
    db.chat_sessions.forEach(function (row) {
      if (row.guest_id === guestId && row.status === "Open") session = row;
    });
    return {
      session: session,
      messages: session ? messagesFor(session.session_id) : []
    };
  }

  function openChats() {
    return db.chat_sessions.filter(function (session) {
      return session.escalated && session.status === "Open";
    }).map(function (session) {
      var guest = db.users.find(function (user) { return user.user_id === session.guest_id; });
      var messages = messagesFor(session.session_id);
      var last = messages[messages.length - 1];
      return {
        session: session,
        guest_name: guest ? guest.name : "Guest",
        last: last || null,
        messages: messages
      };
    });
  }

  function deskLists() {
    var today = todayISO();
    function pack(row) { return booking(row.reservation_id); }
    return {
      arrivals: db.reservations.filter(function (row) {
        return row.status === "Confirmed" && row.check_in_date <= today && today < row.check_out_date;
      }).map(pack),
      upcoming: db.reservations.filter(function (row) {
        return row.status === "Confirmed" && row.check_in_date > today;
      }).map(pack),
      inhouse: db.reservations.filter(function (row) {
        return row.status === "Checked-In";
      }).map(pack),
      rooms: db.rooms.map(function (room) {
        var log = db.room_status_updates.filter(function (row) { return row.room_id === room.room_id; });
        return { room: room, last: log[log.length - 1] || null };
      })
    };
  }

  function reset() {
    db = seed();
    save();
  }

  window.HotelStore = {
    current: current,
    login: login,
    logout: logout,
    register: register,
    searchRooms: searchRooms,
    makeReservation: makeReservation,
    payOnline: payOnline,
    cancelBooking: cancelBooking,
    modifyBooking: modifyBooking,
    orderRoomService: orderRoomService,
    cancelRoomService: cancelRoomService,
    leaveReview: leaveReview,
    checkInGuest: checkInGuest,
    checkOutGuest: checkOutGuest,
    updateRoomStatus: updateRoomStatus,
    markDelivered: markDelivered,
    sendChat: sendChat,
    escalateChat: escalateChat,
    replyToChat: replyToChat,
    endChat: endChat,
    booking: booking,
    myStays: myStays,
    guestChat: guestChat,
    openChats: openChats,
    deskLists: deskLists,
    rooms: function () { return db.rooms.slice(); },
    menu: function () { return MENU.slice(); },
    today: todayISO,
    shiftDate: shiftDate,
    nights: nights,
    reset: reset
  };
})();
