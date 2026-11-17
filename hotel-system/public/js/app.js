(function () {
  'use strict';

  var state = {
    view: 'home',
    search: { checkIn: todayISO(), checkOut: shiftDate(2), type: 'Any' },
    searchRooms: null,
    selectedRoomId: null,
    reservationId: null,
    activeChatId: null,
    panel: '',
    error: '',
    notice: '',
    loading: false,
    chatDraft: '',
    chatMessages: [],
    menu: []
  };

  function pad(n) { return String(n).padStart(2, '0'); }

  function dateISO(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function todayISO() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return dateISO(d);
  }

  function shiftDate(days) {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + days);
    return dateISO(d);
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function egp(n) {
    return 'EGP ' + Number(n || 0).toFixed(2);
  }

  function me() {
    return API.getUser();
  }

  function showNotice(msg) {
    state.notice = msg;
    state.error = '';
    render();
  }

  function showError(msg) {
    state.error = msg;
    state.notice = '';
    render();
  }

  function clearAlerts() {
    state.error = '';
    state.notice = '';
  }

  function go(view, extra) {
    state.view = view;
    clearAlerts();
    state.panel = '';
    if (extra) {
      Object.keys(extra).forEach(function (k) { state[k] = extra[k]; });
    }
    render();
    window.scrollTo(0, 0);
    loadViewData();
  }

  function shell(inner) {
    var user = me();
    var links = '';
    if (user && user.role === 'guest') {
      links = '<button data-go="stays">My Stays</button>' +
              '<button data-go="chat">Assistant</button>';
    } else if (user && user.role === 'receptionist') {
      links = '<button data-go="desk">Desk</button>' +
              '<button data-go="rooms">Rooms</button>' +
              '<button data-go="messages">Guest Messages</button>';
    } else {
      links = '<button data-go="login">Sign In</button>' +
              '<button class="btn" data-go="register">Register</button>';
    }

    var who = user
      ? '<span class="who"><strong>' + esc(user.name) + '</strong> (' + esc(user.role) + ')</span>' +
        '<button data-act="logout">Sign out</button>'
      : '';

    var banner = '';
    if (state.notice) banner += '<div class="banner">' + esc(state.notice) + '</div>';
    if (state.error) banner += '<div class="banner bad">' + esc(state.error) + '</div>';

    return '<header class="wrap top">' +
      '<button class="brand" data-go="home">' +
        '<strong>Nile House</strong>' +
        '<span>A small hotel on the river · Full Stack</span>' +
      '</button>' +
      '<nav class="nav">' + links + who + '</nav>' +
    '</header>' +
    '<main class="wrap">' + banner + inner + '</main>' +
    '<footer class="wrap foot">' +
      '<span>Connected to Node.js + Express + MySQL Backend & Chatbot</span>' +
      '<span>Nile House Hotel System</span>' +
    '</footer>';
  }

  function pill(status) {
    var cleanStatus = String(status || '').trim();
    return '<span class="pill ' + esc(cleanStatus) + '">' + esc(cleanStatus) + '</span>';
  }

  function searchForm() {
    var s = state.search;
    return '<form class="search" data-form="search">' +
      '<label>Check In<input type="date" name="checkIn" required value="' + esc(s.checkIn) + '" min="' + esc(todayISO()) + '"></label>' +
      '<label>Check Out<input type="date" name="checkOut" required value="' + esc(s.checkOut) + '" min="' + esc(shiftDate(1)) + '"></label>' +
      '<label>Room Type<select name="type">' +
        '<option' + (s.type === 'Any' ? ' selected' : '') + '>Any</option>' +
        '<option' + (s.type === 'Single' ? ' selected' : '') + '>Single</option>' +
        '<option' + (s.type === 'Double' ? ' selected' : '') + '>Double</option>' +
        '<option' + (s.type === 'Suite' ? ' selected' : '') + '>Suite</option>' +
      '</select></label>' +
      '<button class="btn" type="submit">Search Rooms</button>' +
    '</form>';
  }

  function roomCard(room, bookable) {
    var tone = (room.type || '').toLowerCase();
    var action = '';
    if (bookable) {
      if (room.isAvailableForDates) {
        action = '<button class="btn" data-act="start-book" data-room="' + room.room_id + '">Book ' + egp(room.totalStayPrice) + '</button>';
      } else {
        action = '<button class="btn" disabled>Booked for these dates</button>';
      }
    }
    return '<article class="card">' +
      '<div>' +
        '<div class="swatch ' + tone + '"><em>' + esc(room.room_number) + '</em></div>' +
        '<h3>' + esc(room.type) + '</h3>' +
        '<div class="meta">' +
          '<span>' + egp(room.price_per_night) + ' / night</span>' +
          pill(room.status) +
        '</div>' +
        (room.nights ? '<p class="note">' + room.nights + ' night(s) · Total: ' + egp(room.totalStayPrice) + '</p>' : '') +
      '</div>' +
      action +
    '</article>';
  }

  // View: Home
  function viewHome() {
    var rooms = state.roomsList || [];
    var occupiedCount = rooms.filter(function (r) { return r.status === 'Occupied'; }).length;
    return '<section class="hero">' +
      '<div>' +
        '<p class="eyebrow">Cairo, Nile Front</p>' +
        '<h1>Stay where the morning is slow.</h1>' +
        '<p class="lede">Search by your travel dates. Database tracks real-time physical status and reservations.</p>' +
      '</div>' +
      '<aside class="hero-card">' +
        '<span>Tonight in the house</span>' +
        '<strong>' + occupiedCount + ' rooms occupied</strong>' +
        '<span>' + rooms.length + ' rooms total · Singles, Doubles, Suites</span>' +
      '</aside>' +
    '</section>' +
    searchForm() +
    '<section class="section">' +
      '<h2>Our Rooms</h2>' +
      '<p class="note">Real-time room status directly from MySQL.</p>' +
      '<div class="grid">' +
        (rooms.length ? rooms.map(function (r) { return roomCard(r, false); }).join('') : '<p class="note">Loading rooms...</p>') +
      '</div>' +
    '</section>';
  }

  // View: Search Results
  function viewResults() {
    var rooms = state.searchRooms || [];
    return '<section class="section">' +
      '<h2>Available Rooms for ' + esc(state.search.checkIn) + ' to ' + esc(state.search.checkOut) + '</h2>' +
      '<p class="note">Filtered against overlapping confirmed, checked-in, and pending bookings in the database.</p>' +
    '</section>' +
    searchForm() +
    '<div class="grid">' +
      (rooms.length ? rooms.map(function (r) { return roomCard(r, true); }).join('') : '<p class="note">No rooms match your search.</p>') +
    '</div>';
  }

  // View: Auth Card
  function authCard(mode) {
    var isRegister = mode === 'register';
    var fields = isRegister
      ? '<label>Full Name<input name="name" required placeholder="e.g. Omar Hassan"></label>' +
        '<label>Phone Number<input name="phone" required placeholder="e.g. 01001234567"></label>'
      : '';

    return '<section class="section split">' +
      '<form class="panel stack" data-form="' + mode + '">' +
        '<p class="eyebrow">' + (isRegister ? 'New Guest Account' : 'Welcome Back') + '</p>' +
        '<h2>' + (isRegister ? 'Register' : 'Sign In') + '</h2>' +
        fields +
        '<label>Email Address<input type="email" name="email" required placeholder="user@example.com"></label>' +
        '<label>Password<input type="password" name="password" required minlength="4" placeholder="••••••••"></label>' +
        '<button class="btn" type="submit">' + (isRegister ? 'Register & Sign In' : 'Sign In') + '</button>' +
        '<button type="button" class="btn-line" data-go="' + (isRegister ? 'login' : 'register') + '">' +
          (isRegister ? 'I already have an account' : 'Create a guest account') +
        '</button>' +
      '</form>' +
      '<aside class="panel">' +
        '<h3>Demo Accounts</h3>' +
        '<div class="accounts">' +
          '<button type="button" class="btn-line" data-fill="omar@example.com,demo123">Guest: Omar (Pending)</button>' +
          '<button type="button" class="btn-line" data-fill="sara@example.com,demo123">Guest: Sara (Confirmed)</button>' +
          '<button type="button" class="btn-line" data-fill="mona@example.com,demo123">Guest: Mona (Checked-In)</button>' +
          '<button type="button" class="btn-line" data-fill="ahmed@hotel.com,staff123">Receptionist: Ahmed</button>' +
        '</div>' +
        '<p class="note" style="margin-top:14px;">Click any demo account above to pre-fill credentials.</p>' +
      '</aside>' +
    '</section>';
  }

  // View: My Stays (Guest)
  function viewStays() {
    var stays = state.myStays || [];
    var rows = stays.length ? stays.map(function (stay) {
      return '<tr>' +
        '<td><strong>#' + stay.reservation_id + '</strong></td>' +
        '<td>Room ' + esc(stay.room_number) + ' · ' + esc(stay.room_type) + '</td>' +
        '<td>' + esc(stay.check_in_date) + ' → ' + esc(stay.check_out_date) + '</td>' +
        '<td>' + pill(stay.status) + '</td>' +
        '<td>' + egp(stay.balance) + '</td>' +
        '<td><button class="btn-line" data-go="booking" data-id="' + stay.reservation_id + '">View Details</button></td>' +
      '</tr>';
    }).join('') : '<tr><td colspan="6">You have no reservations yet. Search a room on the home page!</td></tr>';

    return '<section class="section">' +
      '<h2>My Stays</h2>' +
      '<table>' +
        '<thead>' +
          '<tr><th>Booking</th><th>Room</th><th>Dates</th><th>Status</th><th>Balance</th><th></th></tr>' +
        '</thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table>' +
    '</section>';
  }

  // View: Single Booking Details
  function viewBooking() {
    var user = me();
    var stay = state.currentStay;
    if (!stay) return '<section class="section"><h2>Loading reservation details...</h2></section>';

    var b = stay.bill || {};
    var isOwner = user && (user.userId === stay.guest_id || user.role === 'receptionist');
    if (!isOwner) return '<section class="section"><h2>Access restricted.</h2></section>';

    var guestBits = '';
    if (user.role === 'guest') {
      if (stay.status === 'Pending' || stay.status === 'Confirmed') {
        if (b.balance > 0) {
          guestBits += '<button class="btn" data-panel="pay">Pay Online (' + egp(b.balance) + ')</button>';
        }
        guestBits += '<button class="btn-line" data-panel="modify">Modify Dates</button>' +
                     '<button class="btn-line danger" data-act="cancel-booking" data-id="' + stay.reservation_id + '">Cancel Booking</button>';
      }
      if (stay.status === 'Checked-In') {
        guestBits += '<button class="btn" data-panel="service">Order Room Service</button>';
      }
      if ((stay.status === 'Checked-Out' || stay.status === 'Completed' || stay.status === 'COMPLETED') && !stay.review) {
        guestBits += '<button class="btn" data-panel="review">Leave a Review</button>';
      }
    }

    var deskBits = '';
    if (user.role === 'receptionist') {
      if (stay.status === 'Confirmed') {
        deskBits += '<button class="btn" data-act="desk-check-in" data-id="' + stay.reservation_id + '">Check In Guest</button>';
      }
      if (stay.status === 'Checked-In') {
        deskBits += '<button class="btn" data-panel="desk-checkout">Check Out Guest</button>';
      }
    }

    // Panels
    var panelHtml = '';
    if (state.panel === 'pay') {
      panelHtml = '<form class="panel stack" data-form="pay-online">' +
        '<h3>Pay Online · ' + egp(b.balance) + '</h3>' +
        '<label>Card Number<input name="card" placeholder="4242 4242 4242 4242" required></label>' +
        '<button class="btn" type="submit">Submit Payment</button>' +
      '</form>';
    } else if (state.panel === 'modify') {
      panelHtml = '<form class="panel stack" data-form="modify-dates">' +
        '<h3>Modify Dates for Room ' + esc(stay.room_number) + '</h3>' +
        '<label>New Check In<input type="date" name="newCheckInDate" required value="' + esc(stay.check_in_date) + '" min="' + esc(todayISO()) + '"></label>' +
        '<label>New Check Out<input type="date" name="newCheckOutDate" required value="' + esc(stay.check_out_date) + '"></label>' +
        '<button class="btn" type="submit">Update Reservation</button>' +
      '</form>';
    } else if (state.panel === 'service') {
      var menuList = state.menuList || [];
      var itemsHtml = menuList.map(function (item, idx) {
        return '<label>' + esc(item.name) + ' (' + egp(item.price) + ')' +
          '<input type="number" name="qty_' + item.id + '" data-price="' + item.price + '" data-name="' + esc(item.name) + '" min="0" max="10" value="0">' +
        '</label>';
      }).join('');
      panelHtml = '<form class="panel stack" data-form="order-service">' +
        '<h3>Order Room Service</h3>' + itemsHtml +
        '<button class="btn" type="submit">Send Order</button>' +
      '</form>';
    } else if (state.panel === 'review') {
      panelHtml = '<form class="panel stack" data-form="submit-review">' +
        '<h3>Rate Your Stay</h3>' +
        '<label>Rating (1 to 5 Stars)' +
          '<select name="rating"><option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option><option value="4">⭐⭐⭐⭐ 4 - Good</option><option value="3">⭐⭐⭐ 3 - Average</option><option value="2">⭐⭐ 2 - Poor</option><option value="1">⭐ 1 - Terrible</option></select>' +
        '</label>' +
        '<label>Comment<textarea name="comment" placeholder="Tell us about your experience..."></textarea></label>' +
        '<button class="btn" type="submit">Submit Review</button>' +
      '</form>';
    } else if (state.panel === 'desk-checkout') {
      panelHtml = '<form class="panel stack" data-form="process-checkout">' +
        '<h3>Process Guest Check-Out</h3>' +
        '<p>Balance Due: <strong>' + egp(b.balance) + '</strong></p>' +
        (b.balance > 0 ? '<label>Payment Method<select name="method"><option>Credit Card</option><option>Cash</option></select></label>' : '') +
        '<button class="btn" type="submit">Complete Check-Out</button>' +
      '</form>';
    }

    var ordersHtml = stay.orders && stay.orders.length ? stay.orders.map(function (o) {
      var cancelBtn = (user.role === 'guest' && o.status === 'Placed')
        ? ' <button class="btn-line danger" data-act="cancel-order" data-id="' + o.order_id + '">Cancel</button>'
        : '';
      var deliverBtn = (user.role === 'receptionist' && o.status === 'Placed')
        ? ' <button class="btn-line" data-act="deliver-order" data-id="' + o.order_id + '">Mark Delivered</button>'
        : '';
      return '<div class="list-row">' +
        '<span>' + esc(o.items) + ' · ' + pill(o.status) + cancelBtn + deliverBtn + '</span>' +
        '<span>' + egp(o.total_price) + '</span>' +
      '</div>';
    }).join('') : '<p class="note">No room service orders placed.</p>';

    var paymentsHtml = stay.payments && stay.payments.length ? stay.payments.map(function (p) {
      return '<div class="list-row">' +
        '<span>' + esc(p.method) + ' · ' + pill(p.status) + (p.gateway_ref ? ' (' + esc(p.gateway_ref) + ')' : '') + '</span>' +
        '<span>' + egp(p.amount) + '</span>' +
      '</div>';
    }).join('') : '<p class="note">No payments recorded yet.</p>';

    var reviewHtml = stay.review
      ? '<div style="margin-top:14px; padding:12px; background:#fff; border-radius:12px; border:1px solid var(--line);">' +
          '<strong>Rating: ' + stay.review.rating + '/5 ⭐</strong>' +
          '<p>' + esc(stay.review.comment || 'No written comment.') + '</p>' +
        '</div>'
      : '';

    return '<section class="section">' +
      '<p class="eyebrow">Reservation #' + stay.reservation_id + '</p>' +
      '<h2>' + esc(stay.guest_name) + ' · Room ' + esc(stay.room_number) + ' (' + esc(stay.room_type) + ')</h2>' +
      '<p>' + esc(stay.check_in_date) + ' → ' + esc(stay.check_out_date) + ' · Status: ' + pill(stay.status) + '</p>' +
      '<div class="row-actions">' + guestBits + deskBits + '</div>' +
    '</section>' +
    '<div class="split">' +
      '<div class="stack">' +
        '<div class="panel"><h3>Room Service</h3>' + ordersHtml + '</div>' +
        '<div class="panel"><h3>Payments & Invoices</h3>' + paymentsHtml + reviewHtml + '</div>' +
        panelHtml +
      '</div>' +
      '<aside class="bill">' +
        '<h3>Bill Statement</h3>' +
        '<div><span>Room Stay</span><span>' + egp(b.roomTotal) + '</span></div>' +
        '<div><span>Room Service</span><span>' + egp(b.serviceTotal) + '</span></div>' +
        '<div><span>Paid Total</span><span>' + egp(b.amountPaid) + '</span></div>' +
        '<div class="due"><span>Balance Due</span><span>' + egp(b.balance) + '</span></div>' +
      '</aside>' +
    '</div>';
  }

  // View: Receptionist Desk Board
  function viewDesk() {
    var board = state.deskBoard || { arrivals: [], inHouse: [], upcoming: [] };

    function renderTable(list, type) {
      if (!list || !list.length) return '<p class="note">None currently.</p>';
      return '<table><tbody>' + list.map(function (s) {
        var act = '';
        if (type === 'arrivals') {
          act = '<button class="btn" data-act="desk-check-in" data-id="' + s.reservation_id + '">Check In</button>';
        } else if (type === 'inHouse') {
          act = '<button class="btn-line" data-go="booking" data-id="' + s.reservation_id + '">Manage / Check Out</button>';
        } else {
          act = '<button class="btn-line" data-go="booking" data-id="' + s.reservation_id + '">View</button>';
        }
        return '<tr>' +
          '<td><strong>#' + s.reservation_id + '</strong> ' + esc(s.guest_name) + '</td>' +
          '<td>Room ' + esc(s.room_number) + ' (' + esc(s.type) + ')</td>' +
          '<td>' + esc(s.check_in_date) + ' → ' + esc(s.check_out_date) + '</td>' +
          '<td>' + pill(s.status) + '</td>' +
          '<td>' + act + '</td>' +
        '</tr>';
      }).join('') + '</tbody></table>';
    }

    return '<section class="section">' +
      '<h2>Front Desk Operations</h2>' +
      '<p class="note">Manage arrivals, check-in, check-out, and guest invoicing (Sequences 3 & 4).</p>' +
      '<div class="stack">' +
        '<div class="panel"><h3>Arrivals Today</h3>' + renderTable(board.arrivals, 'arrivals') + '</div>' +
        '<div class="panel"><h3>In The House (Checked-In Guests)</h3>' + renderTable(board.inHouse, 'inHouse') + '</div>' +
        '<div class="panel"><h3>Upcoming Confirmed Stays</h3>' + renderTable(board.upcoming, 'upcoming') + '</div>' +
      '</div>' +
    '</section>';
  }

  // View: Receptionist Rooms Board
  function viewRooms() {
    var rooms = state.roomsList || [];
    var logs = state.roomLogs || [];

    var rows = rooms.map(function (r) {
      return '<tr>' +
        '<td><strong>Room ' + esc(r.room_number) + '</strong></td>' +
        '<td>' + esc(r.type) + '</td>' +
        '<td>' + egp(r.price_per_night) + '</td>' +
        '<td>' + pill(r.status) + '</td>' +
        '<td>' +
          '<form data-form="update-room-status" style="display:flex; gap:8px;">' +
            '<input type="hidden" name="roomId" value="' + r.room_id + '">' +
            '<select name="newStatus">' +
              '<option' + (r.status === 'Available' ? ' selected' : '') + '>Available</option>' +
              '<option' + (r.status === 'Occupied' ? ' selected' : '') + '>Occupied</option>' +
              '<option' + (r.status === 'Dirty' ? ' selected' : '') + '>Dirty</option>' +
            '</select>' +
            '<button class="btn-line" type="submit">Save</button>' +
          '</form>' +
        '</td>' +
      '</tr>';
    }).join('');

    var logRows = logs.length ? logs.map(function (l) {
      return '<div class="list-row">' +
        '<span>Room ' + esc(l.room_number) + ' → ' + pill(l.new_status) + '</span>' +
        '<span class="note">' + esc(l.receptionist_name) + ' (ID: ' + esc(l.employee_id) + ') · ' + esc(l.updated_at) + '</span>' +
      '</div>';
    }).join('') : '<p class="note">No room updates recorded yet.</p>';

    return '<section class="section">' +
      '<h2>Room Inventory & Physical Status</h2>' +
      '<table>' +
        '<thead><tr><th>Room</th><th>Type</th><th>Price / Night</th><th>Status</th><th>Update Status</th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table>' +
    '</section>' +
    '<section class="section panel">' +
      '<h3>Room Status Audit Log (room_status_update)</h3>' + logRows +
    '</section>';
  }

  // View: Chatbot Assistant (Guest View, Sequence 2)
  function viewChat() {
    var history = state.chatHistory || [];

    var bubblesHtml = history.length ? history.map(function (c) {
      var botBubble = '<div class="bubble ' + (c.receptionist_id ? 'Receptionist' : 'Bot') + '">' +
        '<small>' + (c.receptionist_id ? '🏨 Front Desk Receptionist (' + esc(c.receptionist_name || 'Staff') + ')' : '🤖 Hotel AI Assistant') + '</small>' +
        esc(c.response) +
      '</div>';

      return '<div class="bubble Guest"><small>You</small>' + esc(c.message) + '</div>' + botBubble;
    }).join('') : '<div class="bubble Bot"><small>🤖 Hotel AI Assistant</small>Hello! I am your Nile House assistant. Ask me anything about room rates, availability, our services, or your own bookings! If you need personal assistance, simply ask to talk to the receptionist.</div>';

    return '<section class="section">' +
      '<h2>Nile House Assistant & Support</h2>' +
      '<p class="note">Answers inquiries dynamically from MySQL. Automatically transfers to receptionist upon request (Sequence 2).</p>' +
      '<div class="thread" id="chatThread">' + bubblesHtml + '</div>' +
      '<form class="composer" data-form="send-chat">' +
        '<input name="message" placeholder="Ask about prices, rooms, check-in, or your booking..." required autocomplete="off">' +
        '<button class="btn" type="submit">Send</button>' +
      '</form>' +
      '<div style="margin-top:12px; display:flex; gap:10px;">' +
        '<button class="btn-line" type="button" data-act="escalate-desk">🛎️ Transfer to Receptionist</button>' +
      '</div>' +
    '</section>';
  }

  // View: Receptionist Guest Messages (Sequence 2 Escalated Chats)
  function viewMessages() {
    var chats = state.escalatedChats || [];
    var activeChat = chats.find(function (c) { return c.chat_id === state.activeChatId; }) || chats[0];

    var listHtml = chats.length ? chats.map(function (c) {
      var isAct = activeChat && activeChat.chat_id === c.chat_id ? ' active' : '';
      return '<button class="' + isAct + '" data-act="select-chat" data-id="' + c.chat_id + '">' +
        '<strong>' + esc(c.guest_name) + '</strong> (' + esc(c.guest_phone) + ')<br>' +
        '<span class="note">' + esc(c.message) + '</span>' +
      '</button>';
    }).join('') : '<p class="note">No escalated guest inquiries.</p>';

    var paneHtml = activeChat
      ? '<div class="panel stack">' +
          '<h3>Inquiry from ' + esc(activeChat.guest_name) + ' (Phone: ' + esc(activeChat.guest_phone) + ')</h3>' +
          '<div class="bubble Guest"><small>Guest Question</small>' + esc(activeChat.message) + '</div>' +
          '<div class="bubble Bot"><small>Current Status</small>' + esc(activeChat.response) + '</div>' +
          '<form class="stack" data-form="reply-guest-chat" data-id="' + activeChat.chat_id + '">' +
            '<label>Your Reply to Guest<textarea name="replyMessage" required placeholder="Type your response as receptionist..."></textarea></label>' +
            '<button class="btn" type="submit">Send Reply</button>' +
          '</form>' +
        '</div>'
      : '<p class="note">Select a guest inquiry from the list.</p>';

    return '<section class="section">' +
      '<h2>Escalated Guest Messages</h2>' +
      '<p class="note">Inquiries forwarded from the chatbot requiring front desk intervention.</p>' +
      '<div class="split">' +
        '<div class="chat-list">' + listHtml + '</div>' +
        '<div>' + paneHtml + '</div>' +
      '</div>' +
    '</section>';
  }

  // Main Render function
  function render() {
    var user = me();
    var view = state.view;

    // View protection
    if ((view === 'stays' || view === 'chat') && (!user || user.role !== 'guest')) view = 'login';
    if (view === 'booking' && !user) view = 'login';
    if ((view === 'desk' || view === 'rooms' || view === 'messages') && (!user || user.role !== 'receptionist')) view = 'login';

    var inner = view === 'home' ? viewHome()
      : view === 'results' ? viewResults()
      : view === 'login' ? authCard('login')
      : view === 'register' ? authCard('register')
      : view === 'stays' ? viewStays()
      : view === 'booking' ? viewBooking()
      : view === 'desk' ? viewDesk()
      : view === 'rooms' ? viewRooms()
      : view === 'messages' ? viewMessages()
      : view === 'chat' ? viewChat()
      : viewHome();

    var appEl = document.getElementById('app');
    if (appEl) {
      appEl.innerHTML = shell(inner);
    }

    // Scroll chat to bottom if chat view
    if (view === 'chat') {
      var thread = document.getElementById('chatThread');
      if (thread) thread.scrollTop = thread.scrollHeight;
    }
  }

  // Load backend data for current view
  async function loadViewData() {
    try {
      var user = me();

      if (state.view === 'home') {
        var res = await API.getRooms();
        if (res.success) {
          state.roomsList = res.rooms;
          render();
        }
      } else if (state.view === 'stays') {
        var staysRes = await API.getMyReservations();
        if (staysRes.success) {
          state.myStays = staysRes.stays;
          render();
        }
      } else if (state.view === 'booking' && state.reservationId) {
        var bRes = await API.getReservation(state.reservationId);
        if (bRes.success) {
          state.currentStay = bRes.reservation;
          var menuRes = await API.getMenu();
          if (menuRes.success) state.menuList = menuRes.menu;
          render();
        }
      } else if (state.view === 'desk') {
        var dRes = await API.getDeskBoard();
        if (dRes.success) {
          state.deskBoard = dRes.board;
          render();
        }
      } else if (state.view === 'rooms') {
        var rRes = await API.getRooms();
        var lRes = await API.getRoomStatusLog();
        if (rRes.success) state.roomsList = rRes.rooms;
        if (lRes.success) state.roomLogs = lRes.log;
        render();
      } else if (state.view === 'chat') {
        var cRes = await API.getChatHistory();
        if (cRes.success) {
          state.chatHistory = cRes.history;
          render();
        }
      } else if (state.view === 'messages') {
        var mRes = await API.getEscalatedChats();
        if (mRes.success) {
          state.escalatedChats = mRes.chats;
          render();
        }
      }
    } catch (err) {
      console.warn('View data loading error:', err.message);
    }
  }

  // Event Listeners
  document.addEventListener('click', async function (e) {
    // Nav / go clicks
    var goBtn = e.target.closest('[data-go]');
    if (goBtn) {
      var targetView = goBtn.dataset.go;
      var targetId = goBtn.dataset.id ? Number(goBtn.dataset.id) : state.reservationId;
      go(targetView, { reservationId: targetId });
      return;
    }

    // Fill demo account
    var fillBtn = e.target.closest('[data-fill]');
    if (fillBtn) {
      var parts = fillBtn.dataset.fill.split(',');
      var form = document.querySelector('form[data-form="login"]');
      if (form) {
        form.email.value = parts[0];
        form.password.value = parts[1];
      }
      return;
    }

    // Logout
    var logoutBtn = e.target.closest('[data-act="logout"]');
    if (logoutBtn) {
      API.clearSession();
      showNotice('Signed out successfully.');
      go('home');
      return;
    }

    // Panel toggling
    var panelBtn = e.target.closest('[data-panel]');
    if (panelBtn) {
      state.panel = panelBtn.dataset.panel;
      clearAlerts();
      render();
      return;
    }

    // Start booking a room
    var startBookBtn = e.target.closest('[data-act="start-book"]');
    if (startBookBtn) {
      var roomId = Number(startBookBtn.dataset.room);
      var user = me();
      if (!user) {
        showError('Please sign in or register to complete your booking.');
        go('login');
        return;
      }
      if (user.role !== 'guest') {
        showError('Only guest accounts can create bookings.');
        return;
      }

      var confirmBook = confirm('Do you want to confirm this booking and pay online now? (Click Cancel to create a Pending reservation to pay later)');
      try {
        var res = await API.createReservation({
          roomId: roomId,
          checkInDate: state.search.checkIn,
          checkOutDate: state.search.checkOut,
          payOnline: confirmBook
        });
        showNotice(res.message);
        go('booking', { reservationId: res.reservation.reservationId });
      } catch (err) {
        showError(err.message);
      }
      return;
    }

    // Cancel booking (Sequence 5)
    var cancelBookBtn = e.target.closest('[data-act="cancel-booking"]');
    if (cancelBookBtn) {
      if (!confirm('Are you sure you want to cancel this booking? If already paid, a refund will be processed.')) return;
      try {
        var res = await API.cancelReservation(cancelBookBtn.dataset.id);
        showNotice(res.message + (res.refundedAmount > 0 ? ' (Refunded: ' + egp(res.refundedAmount) + ')' : ''));
        loadViewData();
      } catch (err) {
        showError(err.message);
      }
      return;
    }

    // Receptionist Check In (Sequence 3)
    var checkInBtn = e.target.closest('[data-act="desk-check-in"]');
    if (checkInBtn) {
      try {
        var res = await API.checkInGuest(checkInBtn.dataset.id);
        showNotice(res.message);
        loadViewData();
      } catch (err) {
        showError(err.message);
      }
      return;
    }

    // Escalate to receptionist (Sequence 2)
    var escBtn = e.target.closest('[data-act="escalate-desk"]');
    if (escBtn) {
      try {
        var res = await API.escalateChat();
        showNotice(res.message);
        loadViewData();
      } catch (err) {
        showError(err.message);
      }
      return;
    }

    // Select escalated chat in receptionist view
    var chatSelectBtn = e.target.closest('[data-act="select-chat"]');
    if (chatSelectBtn) {
      state.activeChatId = Number(chatSelectBtn.dataset.id);
      render();
      return;
    }

    // Mark room service delivered
    var delOrderBtn = e.target.closest('[data-act="deliver-order"]');
    if (delOrderBtn) {
      try {
        await API.updateOrderStatus(delOrderBtn.dataset.id, 'Delivered');
        showNotice('Order marked as delivered.');
        loadViewData();
      } catch (err) {
        showError(err.message);
      }
      return;
    }

    // Cancel room service order
    var cancelOrderBtn = e.target.closest('[data-act="cancel-order"]');
    if (cancelOrderBtn) {
      try {
        await API.updateOrderStatus(cancelOrderBtn.dataset.id, 'Cancelled');
        showNotice('Order cancelled.');
        loadViewData();
      } catch (err) {
        showError(err.message);
      }
      return;
    }
  });

  // Form Submissions
  document.addEventListener('submit', async function (e) {
    e.preventDefault();
    var form = e.target;
    var formType = form.dataset.form;

    // Search Form
    if (formType === 'search') {
      var checkIn = form.checkIn.value;
      var checkOut = form.checkOut.value;
      var type = form.type.value;

      state.search = { checkIn: checkIn, checkOut: checkOut, type: type };
      try {
        var res = await API.getRooms({ checkIn: checkIn, checkOut: checkOut, type: type });
        if (res.success) {
          state.searchRooms = res.rooms;
          go('results');
        }
      } catch (err) {
        showError(err.message);
      }
      return;
    }

    // Sign In Form
    if (formType === 'login') {
      var email = form.email.value;
      var password = form.password.value;
      try {
        var res = await API.login(email, password);
        showNotice('Welcome back, ' + res.user.name + '!');
        if (res.user.role === 'receptionist') {
          go('desk');
        } else {
          go('home');
        }
      } catch (err) {
        showError(err.message);
      }
      return;
    }

    // Register Form
    if (formType === 'register') {
      var name = form.name.value;
      var email = form.email.value;
      var password = form.password.value;
      var phone = form.phone.value;
      try {
        var res = await API.register(name, email, password, phone);
        showNotice('Account registered successfully! Welcome, ' + res.user.name + '.');
        go('home');
      } catch (err) {
        showError(err.message);
      }
      return;
    }

    // Pay Online Form
    if (formType === 'pay-online') {
      var card = form.card.value;
      var stay = state.currentStay;
      try {
        var res = await API.processPayment(stay.reservation_id, stay.bill.balance, 'Online', card);
        showNotice(res.message);
        state.panel = '';
        loadViewData();
      } catch (err) {
        showError(err.message);
      }
      return;
    }

    // Modify Dates Form (Sequence 5)
    if (formType === 'modify-dates') {
      var newIn = form.newCheckInDate.value;
      var newOut = form.newCheckOutDate.value;
      try {
        var res = await API.modifyReservation(state.reservationId, newIn, newOut);
        showNotice(res.message);
        state.panel = '';
        loadViewData();
      } catch (err) {
        showError(err.message);
      }
      return;
    }

    // Order Room Service Form
    if (formType === 'order-service') {
      var selected = [];
      var total = 0;
      var inputs = form.querySelectorAll('input[type="number"]');
      inputs.forEach(function (inp) {
        var qty = Number(inp.value);
        if (qty > 0) {
          var name = inp.dataset.name;
          var price = Number(inp.dataset.price);
          selected.push(qty + 'x ' + name);
          total += qty * price;
        }
      });

      if (!selected.length) {
        showError('Please choose at least 1 item.');
        return;
      }

      try {
        var res = await API.placeRoomServiceOrder(state.reservationId, selected, total);
        showNotice(res.message);
        state.panel = '';
        loadViewData();
      } catch (err) {
        showError(err.message);
      }
      return;
    }

    // Submit Review Form
    if (formType === 'submit-review') {
      var rating = Number(form.rating.value);
      var comment = form.comment.value;
      try {
        var res = await API.submitReview(state.reservationId, rating, comment);
        showNotice(res.message);
        state.panel = '';
        loadViewData();
      } catch (err) {
        showError(err.message);
      }
      return;
    }

    // Receptionist Process Check-out (Sequence 4)
    if (formType === 'process-checkout') {
      var method = form.method ? form.method.value : 'Credit Card';
      try {
        var res = await API.checkOutGuest(state.reservationId, method);
        showNotice(res.message + ' (Invoice generated. Balance cleared.)');
        state.panel = '';
        loadViewData();
      } catch (err) {
        showError(err.message);
      }
      return;
    }

    // Update Room Physical Status (Receptionist)
    if (formType === 'update-room-status') {
      var rId = form.roomId.value;
      var newStat = form.newStatus.value;
      try {
        var res = await API.updateRoomStatus(rId, newStat);
        showNotice(res.message);
        loadViewData();
      } catch (err) {
        showError(err.message);
      }
      return;
    }

    // Send Chat Message (Sequence 2)
    if (formType === 'send-chat') {
      var msg = form.message.value;
      form.message.value = '';
      try {
        await API.sendChatMessage(msg);
        loadViewData();
      } catch (err) {
        showError(err.message);
      }
      return;
    }

    // Reply to escalated chat (Sequence 2)
    if (formType === 'reply-guest-chat') {
      var cId = form.dataset.id;
      var reply = form.replyMessage.value;
      try {
        var res = await API.replyToChat(cId, reply);
        showNotice(res.message);
        loadViewData();
      } catch (err) {
        showError(err.message);
      }
      return;
    }
  });

  // Initial Boot
  go('home');
})();
