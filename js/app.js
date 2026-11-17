(function () {
  var state = {
    view: "home",
    search: { checkIn: Hotel.today(), checkOut: addDays(Hotel.today(), 2), type: "Any" },
    roomId: null,
    reservationId: null,
    sessionId: null,
    panel: "",
    error: "",
    notice: "",
    chatDraft: ""
  };

  function addDays(iso, n) {
    var p = iso.split("-").map(Number);
    var dt = new Date(p[0], p[1] - 1, p[2]);
    dt.setDate(dt.getDate() + n);
    var pad = function (v) { return String(v).padStart(2, "0"); };
    return dt.getFullYear() + "-" + pad(dt.getMonth() + 1) + "-" + pad(dt.getDate());
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function egp(n) { return "EGP " + Number(n).toFixed(2); }

  function go(view, extra) {
    state.view = view;
    state.error = "";
    state.notice = "";
    state.panel = "";
    if (extra) {
      Object.keys(extra).forEach(function (key) { state[key] = extra[key]; });
    }
    render();
    window.scrollTo(0, 0);
  }

  function fail(message) {
    state.error = message;
    render();
  }

  function me() { return Hotel.current(); }

  function shell(inner) {
    var user = me();
    var links = "";
    if (user && user.role === "guest") {
      links = '<button data-go="stays">My stays</button><button data-go="chat">Assistant</button>';
    } else if (user && user.role === "receptionist") {
      links = '<button data-go="desk">Desk</button><button data-go="rooms">Rooms</button><button data-go="messages">Messages</button>';
    } else {
      links = '<button data-go="login">Sign in</button><button class="btn" data-go="register">Register</button>';
    }
    var who = user ? '<span class="who">' + esc(user.name) + '</span><button data-act="logout">Sign out</button>' : "";
    var banner = "";
    if (state.notice) banner += '<div class="banner">' + esc(state.notice) + '</div>';
    if (state.error) banner += '<div class="banner bad">' + esc(state.error) + '</div>';
    return '<header class="wrap top"><button class="brand" data-go="home"><strong>Nile House</strong><span>A small hotel on the river</span></button><nav class="nav">' + links + who + '</nav></header><main class="wrap">' + banner + inner + '</main><footer class="wrap foot"><span>Bookings, payments, and chats stay in this browser.</span><button data-act="reset">Restore demo data</button></footer>';
  }

  function pill(status) { return '<span class="pill ' + esc(status) + '">' + esc(status) + '</span>'; }

  function searchForm() {
    var s = state.search;
    return '<form class="search" data-form="search"><label>Check in<input type="date" name="checkIn" required value="' + esc(s.checkIn) + '" min="' + esc(Hotel.today()) + '"></label><label>Check out<input type="date" name="checkOut" required value="' + esc(s.checkOut) + '" min="' + esc(addDays(Hotel.today(), 1)) + '"></label><label>Type<select name="type"><option' + (s.type === "Any" ? " selected" : "") + '>Any</option><option' + (s.type === "Single" ? " selected" : "") + '>Single</option><option' + (s.type === "Double" ? " selected" : "") + '>Double</option><option' + (s.type === "Suite" ? " selected" : "") + '>Suite</option></select></label><button class="btn" type="submit">Search rooms</button></form>';
  }

  function roomCard(room, bookable) {
    var tone = room.type.toLowerCase();
    var action = "";
    if (bookable) {
      action = room.free
        ? '<button class="btn" data-act="book" data-room="' + room.room_id + '">Book ' + egp(room.total) + '</button>'
        : '<button class="btn" disabled>Booked for these dates</button>';
    }
    return '<article class="card"><div class="swatch ' + tone + '"><em>' + esc(room.room_number) + '</em></div><h3>' + esc(room.type) + '</h3><div class="meta"><span>' + egp(room.price_per_night) + ' / night</span>' + pill(room.status) + '</div>' + (room.nights ? '<p>' + room.nights + ' nights · ' + egp(room.total) + '</p>' : '') + action + '</article>';
  }

  function viewHome() {
    var rooms = Hotel.rooms();
    return '<section class="hero"><div><p class="eyebrow">Cairo</p><h1>Stay where the morning is slow.</h1><p class="lede">Search by the dates you want. A room can be occupied or dirty tonight and still be free next week.</p></div><aside class="hero-card"><span>Tonight in the house</span><strong>' + rooms.filter(function (r) { return r.status === "Occupied"; }).length + ' occupied</strong><span>' + rooms.length + ' rooms · singles, doubles, suites</span></aside></section>' + searchForm() + '<section class="section"><h2>The rooms</h2><p class="note">The badge is the physical state tonight. The search decides whether the dates are free.</p><div class="grid">' + rooms.map(function (r) { return roomCard(r, false); }).join("") + '</div></section>';
  }

  function viewResults() {
    var result = Hotel.searchRooms(state.search.checkIn, state.search.checkOut, state.search.type);
    var body = result.ok
      ? '<div class="grid">' + result.rooms.map(function (r) { return roomCard(r, true); }).join("") + '</div>'
      : '<p class="note">' + esc(result.message) + '</p>';
    return '<section class="section"><h2>Rooms for ' + esc(state.search.checkIn) + ' to ' + esc(state.search.checkOut) + '</h2><p class="note">Pending, confirmed, and checked-in stays block a room. Cancelled stays do not.</p></section>' + searchForm() + body;
  }

  function authCard(mode) {
    var register = mode === "register";
    var fields = register
      ? '<label>Name<input name="name" required></label><label>Phone<input name="phone" required></label>'
      : "";
    return '<section class="section split"><form class="panel stack" data-form="' + mode + '"><p class="eyebrow">' + (register ? "Guest account" : "Welcome back") + '</p><h2>' + (register ? "Create an account" : "Sign in") + '</h2>' + fields + '<label>Email<input type="email" name="email" required></label><label>Password<input type="password" name="password" required minlength="6"></label><button class="btn" type="submit">' + (register ? "Register" : "Sign in") + '</button><button type="button" class="btn-line" data-go="' + (register ? "login" : "register") + '">' + (register ? "I already have an account" : "Create a guest account") + '</button></form><aside class="panel"><h3>Demo accounts</h3><div class="accounts"><div><code>omar@example.com</code> pending suite and a past stay</div><div><code>sara@example.com</code> arriving today, already paid</div><div><code>mona@example.com</code> checked in, balance still due</div><div>Guest password <code>demo123</code></div><div><code>ahmed@hotel.com</code> / <code>staff123</code> desk</div></div><p class="note">Passwords are hashed in this browser only. A card ending in 0000 is declined, and the number is never stored.</p></aside></section>';
  }

  function viewStays() {
    var user = me();
    var stays = Hotel.staysFor(user.user_id);
    var rows = stays.length ? stays.map(function (stay) {
      return '<tr><td>#' + stay.reservation_id + '</td><td>' + esc(stay.room.room_number) + ' · ' + esc(stay.room.type) + '</td><td>' + esc(stay.check_in_date) + ' → ' + esc(stay.check_out_date) + '</td><td>' + pill(stay.status) + '</td><td>' + egp(stay.bill.balance) + '</td><td><button class="btn-line" data-go="booking" data-id="' + stay.reservation_id + '">Open</button></td></tr>';
    }).join("") : '<tr><td colspan="6">No stays yet. Search a room from the home page.</td></tr>';
    return '<section class="section"><h2>My stays</h2><table><thead><tr><th>Booking</th><th>Room</th><th>Dates</th><th>Status</th><th>Balance</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></section>';
  }

  function billBox(stay) {
    var b = stay.bill;
    return '<aside class="bill"><h3>Bill</h3><div><span>Room</span><span>' + egp(b.roomTotal) + '</span></div><div><span>Room service</span><span>' + egp(b.service) + '</span></div><div><span>Paid</span><span>' + egp(b.paid) + '</span></div><div class="due"><span>Balance</span><span>' + egp(b.balance) + '</span></div></aside>';
  }

  function viewBooking() {
    var user = me();
    var stay = Hotel.stay(state.reservationId);
    if (!stay) return '<section class="section"><h2>Booking not found</h2></section>';
    if (user.role === "guest" && stay.guest_id !== user.user_id) return '<section class="section"><h2>This stay belongs to another guest.</h2></section>';
    var guestBits = "";
    if (user.role === "guest") {
      if (stay.status === "Pending" || stay.status === "Confirmed") {
        guestBits += '<button class="btn" data-panel="pay">Pay online</button><button class="btn-line" data-panel="modify">Change dates</button><button class="btn-line danger" data-act="cancel" data-id="' + stay.reservation_id + '">Cancel</button>';
      }
      if (stay.status === "Checked-In") guestBits += '<button class="btn" data-panel="service">Order room service</button>';
      if (stay.status === "Checked-Out" && !stay.review) guestBits += '<button class="btn" data-panel="review">Leave a review</button>';
    }
    var deskBits = "";
    if (user.role === "receptionist") {
      if (stay.status === "Confirmed") deskBits += '<button class="btn" data-act="check-in" data-id="' + stay.reservation_id + '">Check in</button>';
      if (stay.status === "Checked-In") deskBits += '<button class="btn" data-panel="checkout">Check out</button>';
    }
    var panel = "";
    if (state.panel === "pay") {
      panel = '<form class="panel stack" data-form="pay"><h3>Pay ' + egp(stay.bill.balance) + '</h3><label>Card number<input name="card" inputmode="numeric" placeholder="4242424242424242" required></label><button class="btn" type="submit">Pay and confirm</button></form>';
    } else if (state.panel === "modify") {
      panel = '<form class="panel stack" data-form="modify"><h3>New dates for room ' + esc(stay.room.room_number) + '</h3><label>Check in<input type="date" name="checkIn" required value="' + esc(stay.check_in_date) + '" min="' + esc(Hotel.today()) + '"></label><label>Check out<input type="date" name="checkOut" required value="' + esc(stay.check_out_date) + '"></label><button class="btn" type="submit">Update booking</button></form>';
    } else if (state.panel === "service") {
      var items = Hotel.MENU.map(function (item, i) {
        return '<label>' + esc(item.name) + ' · ' + egp(item.price) + '<input type="number" name="qty' + i + '" min="0" max="9" value="0"></label>';
      }).join("");
      panel = '<form class="panel stack" data-form="service"><h3>Room service</h3>' + items + '<button class="btn" type="submit">Place order</button></form>';
    } else if (state.panel === "review") {
      panel = '<form class="panel stack" data-form="review"><h3>Review this stay</h3><label>Rating<select name="rating"><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></label><label>Comment<textarea name="comment"></textarea></label><button class="btn" type="submit">Submit review</button></form>';
    } else if (state.panel === "checkout") {
      panel = stay.bill.balance > 0
        ? '<form class="panel stack" data-form="checkout"><h3>Take ' + egp(stay.bill.balance) + '</h3><label>Method<select name="method"><option>Cash</option><option>Credit Card</option></select></label><label>Card, if used<input name="card" placeholder="Only for a card payment"></label><button class="btn" type="submit">Complete check-out</button></form>'
        : '<form class="panel stack" data-form="checkout"><h3>Nothing due</h3><p class="note">The room becomes dirty after check-out, ready for housekeeping.</p><button class="btn" type="submit">Complete check-out</button></form>';
    }
    var orders = stay.orders.length ? stay.orders.map(function (order) {
      var act = "";
      if (user.role === "guest" && order.status === "Placed") act = '<button class="btn-line danger" data-act="cancel-order" data-id="' + order.order_id + '">Cancel</button>';
      if (user.role === "receptionist" && order.status === "Placed") act = '<button class="btn-line" data-act="deliver-order" data-id="' + order.order_id + '">Mark delivered</button>';
      return '<div class="list-row"><span>' + esc(order.items) + ' · ' + pill(order.status) + '</span><span>' + egp(order.total_price) + ' ' + act + '</span></div>';
    }).join("") : '<p class="note">No room service.</p>';
    var payments = stay.payments.length ? stay.payments.map(function (p) {
      return '<div class="list-row"><span>' + esc(p.method) + ' ' + pill(p.status) + (p.gateway_ref ? ' · ' + esc(p.gateway_ref) : '') + '</span><span>' + egp(p.amount) + '</span></div>';
    }).join("") : '<p class="note">No payments yet.</p>';
    var review = stay.review ? '<p>Review ' + stay.review.rating + '/5 — ' + esc(stay.review.comment || "No comment") + '</p>' : '';
    return '<section class="section"><p class="eyebrow">Booking #' + stay.reservation_id + '</p><h2>' + esc(stay.guest_name) + ' · room ' + esc(stay.room.room_number) + '</h2><p>' + esc(stay.check_in_date) + ' → ' + esc(stay.check_out_date) + ' · ' + pill(stay.status) + ' · ' + pill(stay.room.status) + '</p><div class="row-actions">' + guestBits + deskBits + '</div></section><div class="split"><div class="stack"><div class="panel"><h3>Room service</h3>' + orders + '</div><div class="panel"><h3>Payments</h3>' + payments + review + '</div>' + panel + '</div>' + billBox(stay) + '</div>';
  }

  function viewDesk() {
    var board = Hotel.board();
    function table(rows, empty) {
      if (!rows.length) return '<p class="note">' + empty + '</p>';
      return '<table><tbody>' + rows.map(function (stay) {
        return '<tr><td>#' + stay.reservation_id + ' ' + esc(stay.guest_name) + '</td><td>Room ' + esc(stay.room.room_number) + '</td><td>' + esc(stay.check_in_date) + ' → ' + esc(stay.check_out_date) + '</td><td>' + egp(stay.bill.balance) + '</td><td><button class="btn-line" data-go="booking" data-id="' + stay.reservation_id + '">Open</button></td></tr>';
      }).join("") + '</tbody></table>';
    }
    return '<section class="section"><h2>Front desk</h2><p class="note">Check-in is for a confirmed stay whose dates include today. Check-out marks the room dirty.</p><div class="stack"><div class="panel"><h3>Arrivals today</h3>' + table(board.arrivals, "Nobody to check in today.") + '</div><div class="panel"><h3>In the house</h3>' + table(board.inHouse, "No checked-in guests.") + '</div><div class="panel"><h3>Confirmed later</h3>' + table(board.upcoming, "No future confirmed stays.") + '</div></div></section>';
  }

  function viewRooms() {
    var board = Hotel.board();
    var rows = board.rooms.map(function (room) {
      return '<tr><td>' + esc(room.room_number) + '</td><td>' + esc(room.type) + '</td><td>' + egp(room.price_per_night) + '</td><td>' + pill(room.status) + '</td><td><form data-form="room-status"><input type="hidden" name="roomId" value="' + room.room_id + '"><select name="status"><option' + (room.status === "Available" ? " selected" : "") + '>Available</option><option' + (room.status === "Occupied" ? " selected" : "") + '>Occupied</option><option' + (room.status === "Dirty" ? " selected" : "") + '>Dirty</option></select> <button class="btn-line" type="submit">Save</button></form></td></tr>';
    }).join("");
    var log = board.log.map(function (row) {
      return '<div class="list-row"><span>Room ' + esc(row.room_number) + ' → ' + esc(row.new_status) + '</span><span>' + esc(row.receptionist) + ' · ' + esc(row.updated_at) + '</span></div>';
    }).join("");
    return '<section class="section"><h2>Room board</h2><table><thead><tr><th>Room</th><th>Type</th><th>Price</th><th>Tonight</th><th>Update</th></tr></thead><tbody>' + rows + '</tbody></table></section><section class="section panel"><h3>Status log</h3>' + log + '</section>';
  }

  function bubbles(messages) {
    if (!messages || !messages.length) return '<p class="note">No messages yet.</p>';
    return messages.map(function (m) {
      return '<div class="bubble ' + esc(m.sender) + '"><small>' + esc(m.sender) + ' · ' + esc(m.created_at) + '</small>' + esc(m.body) + '</div>';
    }).join("");
  }

  function viewChat() {
    var user = me();
    var thread = Hotel.guestChat(user.user_id);
    var escalate = thread.escalated ? '' : '<button class="btn-line" type="button" data-act="escalate">Ask for the desk</button>';
    return '<section class="section"><h2>Assistant</h2><p class="note">Prices and your own bookings stay here. Anything else goes to the receptionist.</p><div class="thread">' + bubbles(thread.messages) + '</div><form class="composer" data-form="guest-chat"><input id="chat-body" name="body" placeholder="Ask about prices or your booking" value="' + esc(state.chatDraft) + '"><button class="btn" type="submit">Send</button></form>' + escalate + '</section>';
  }

  function viewMessages() {
    var chats = Hotel.deskChats();
    var list = chats.length ? chats.map(function (chat) {
      var last = chat.messages[chat.messages.length - 1];
      var active = state.sessionId === chat.session_id ? " active" : "";
      return '<button class="' + active + '" data-act="open-chat" data-id="' + chat.session_id + '"><strong>' + esc(chat.guest_name) + '</strong><br><span>' + esc(last ? last.body : "") + '</span></button>';
    }).join("") : '<p class="note">No escalated chats.</p>';
    var open = chats.find(function (c) { return c.session_id === state.sessionId; });
    var pane = open
      ? '<div class="thread">' + bubbles(open.messages) + '</div><form class="composer" data-form="desk-chat"><input name="body" placeholder="Reply to ' + esc(open.guest_name) + '" required><button class="btn" type="submit">Reply</button></form>'
      : '<div class="thread"><p class="note">Choose a guest.</p></div>';
    return '<section class="section"><h2>Guest messages</h2><div class="split"><div class="chat-list">' + list + '</div><div>' + pane + '</div></div></section>';
  }

  function render() {
    var user = me();
    var view = state.view;
    if ((view === "stays" || view === "booking" || view === "chat") && (!user || user.role !== "guest") && view !== "booking") view = "login";
    if (view === "booking" && !user) view = "login";
    if ((view === "desk" || view === "rooms" || view === "messages") && (!user || user.role !== "receptionist")) view = "login";
    var html = view === "home" ? viewHome()
      : view === "results" ? viewResults()
      : view === "login" ? authCard("login")
      : view === "register" ? authCard("register")
      : view === "stays" ? viewStays()
      : view === "booking" ? viewBooking()
      : view === "desk" ? viewDesk()
      : view === "rooms" ? viewRooms()
      : view === "messages" ? viewMessages()
      : view === "chat" ? viewChat()
      : viewHome();
    document.getElementById("app").innerHTML = shell(html);
  }

  document.addEventListener("click", function (event) {
    var goBtn = event.target.closest("[data-go]");
    if (goBtn) {
      go(goBtn.dataset.go, {
        reservationId: goBtn.dataset.id ? Number(goBtn.dataset.id) : state.reservationId,
        panel: ""
      });
      return;
    }
    var panelBtn = event.target.closest("[data-panel]");
    if (panelBtn) {
      state.panel = panelBtn.dataset.panel;
      state.error = "";
      render();
      return;
    }
    var act = event.target.closest("[data-act]");
    if (!act) return;
    var user = me();
    var action = act.dataset.act;
    if (action === "logout") { Hotel.logout(); go("home"); return; }
    if (action === "reset") { Hotel.reset(); go("home", { notice: "Demo data is restored." }); return; }
    if (action === "book") {
      if (!user || user.role !== "guest") { go("login", { notice: "Sign in as a guest to book." }); return; }
      var made = Hotel.createReservation(user.user_id, Number(act.dataset.room), state.search.checkIn, state.search.checkOut);
      if (!made.ok) { fail(made.message); return; }
      go("booking", { reservationId: made.reservation.reservation_id, notice: "Booking " + made.reservation.reservation_id + " is pending until you pay." });
      return;
    }
    if (action === "cancel") {
      var cancelled = Hotel.cancelReservation(user.user_id, Number(act.dataset.id));
      if (!cancelled.ok) { fail(cancelled.message); return; }
      var note = cancelled.refunded > 0 ? "Booking cancelled. Refunded " + egp(cancelled.refunded) + "." : "Booking cancelled. The room's dates are free again.";
      go("booking", { reservationId: Number(act.dataset.id), notice: note });
      return;
    }
    if (action === "check-in") {
      var inn = Hotel.checkIn(user.user_id, Number(act.dataset.id));
      if (!inn.ok) { fail(inn.message); return; }
      go("booking", { reservationId: Number(act.dataset.id), notice: "Guest is checked in. The room is occupied." });
      return;
    }
    if (action === "cancel-order" || action === "deliver-order") {
      var next = action === "cancel-order" ? "Cancelled" : "Delivered";
      var updated = Hotel.setOrderStatus(user.user_id, Number(act.dataset.id), next);
      if (!updated.ok) { fail(updated.message); return; }
      go("booking", { reservationId: state.reservationId, notice: "Order " + next.toLowerCase() + "." });
      return;
    }
    if (action === "escalate") {
      Hotel.escalateChat(user.user_id);
      state.chatDraft = "";
      go("chat", { notice: "The desk has this conversation." });
      return;
    }
    if (action === "open-chat") {
      state.sessionId = Number(act.dataset.id);
      state.error = "";
      render();
    }
  });

  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (!form.dataset || !form.dataset.form) return;
    event.preventDefault();
    var data = new FormData(form);
    var user = me();
    var kind = form.dataset.form;
    if (kind === "search") {
      state.search = { checkIn: data.get("checkIn"), checkOut: data.get("checkOut"), type: data.get("type") };
      go("results", { search: state.search });
      return;
    }
    if (kind === "login") {
      var signed = Hotel.login(data.get("email"), data.get("password"));
      if (!signed.ok) { fail(signed.message); return; }
      go(signed.user.role === "receptionist" ? "desk" : "stays", { notice: "Signed in as " + signed.user.name + "." });
      return;
    }
    if (kind === "register") {
      var created = Hotel.register({ name: data.get("name"), email: data.get("email"), phone: data.get("phone"), password: data.get("password") });
      if (!created.ok) { fail(created.message); return; }
      go("home", { notice: "Account ready. Search a room when you want." });
      return;
    }
    if (kind === "pay") {
      var paid = Hotel.payOnline(user.user_id, state.reservationId, data.get("card"));
      if (!paid.ok) { fail(paid.message); return; }
      go("booking", { reservationId: state.reservationId, notice: "Payment confirmed. Reference " + paid.ref + "." });
      return;
    }
    if (kind === "modify") {
      var changed = Hotel.modifyReservation(user.user_id, state.reservationId, data.get("checkIn"), data.get("checkOut"));
      if (!changed.ok) { fail(changed.message); return; }
      var extra = changed.refunded > 0 ? " Refunded " + egp(changed.refunded) + "." : changed.balance > 0 ? " Balance due " + egp(changed.balance) + "." : "";
      go("booking", { reservationId: state.reservationId, notice: "Dates updated." + extra });
      return;
    }
    if (kind === "service") {
      var qty = Hotel.MENU.map(function (_, i) { return data.get("qty" + i); });
      var order = Hotel.orderService(user.user_id, state.reservationId, qty);
      if (!order.ok) { fail(order.message); return; }
      go("booking", { reservationId: state.reservationId, notice: "Order placed for " + egp(order.total) + ". It is on the bill." });
      return;
    }
    if (kind === "review") {
      var review = Hotel.submitReview(user.user_id, state.reservationId, data.get("rating"), data.get("comment"));
      if (!review.ok) { fail(review.message); return; }
      go("booking", { reservationId: state.reservationId, notice: "Review saved." });
      return;
    }
    if (kind === "checkout") {
      var out = Hotel.checkOut(user.user_id, state.reservationId, data.get("method"), data.get("card"));
      if (!out.ok) { fail(out.message); return; }
      go("booking", { reservationId: state.reservationId, notice: out.balance > 0 ? "Checked out. Charged " + egp(out.balance) + ". Room is dirty." : "Checked out. Nothing due. Room is dirty." });
      return;
    }
    if (kind === "room-status") {
      var saved = Hotel.setRoomStatus(user.user_id, data.get("roomId"), data.get("status"));
      if (!saved.ok) { fail(saved.message); return; }
      go("rooms", { notice: "Room status saved in the log." });
      return;
    }
    if (kind === "guest-chat") {
      state.chatDraft = "";
      var sent = Hotel.sendGuestChat(user.user_id, data.get("body"));
      if (!sent.ok) { fail(sent.message); return; }
      render();
      return;
    }
    if (kind === "desk-chat") {
      var reply = Hotel.replyChat(user.user_id, state.sessionId, data.get("body"));
      if (!reply.ok) { fail(reply.message); return; }
      render();
    }
  });

  document.addEventListener("input", function (event) {
    if (event.target.id === "chat-body") state.chatDraft = event.target.value;
  });

  render();
})();
