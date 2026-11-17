(function () {
  'use strict';

  // Language Dictionary
  var I18N = {
    ar: {
      brand: "فندق نايل هاوس",
      tagline: "إقامة هادئة على ضفاف النيل",
      myStays: "حجوزاتي",
      assistant: "المساعد الذكي",
      desk: "مكتب الاستقبال",
      rooms: "إدارة الغرف",
      messages: "رسائل النزلاء",
      signIn: "تسجيل الدخول",
      register: "إنشاء حساب",
      signOut: "تسجيل الخروج",
      heroEyebrow: "القاهرة · كورنيش النيل",
      heroTitle: "حيث الهدوء والفخامة على ضفاف النيل.",
      heroLede: "ابحث بمواعيد إقامتك للاطلاع على الغرف المتاحة والأسعار والخدمات الإضافية.",
      tonightInHouse: "الليلة في الفندق",
      occupiedRooms: "غرفة مشغولة حالياً",
      totalRoomsCount: "غرف إجمالياً · فردي، مزدوج، وسويتات فاخرة",
      checkIn: "تاريخ الوصول",
      checkOut: "تاريخ المغادرة",
      roomType: "نوع الغرفة",
      anyType: "الكل",
      single: "فردية (Single)",
      double: "مزدوجة (Double)",
      suite: "سويت فاخر (Suite)",
      searchRooms: "بحث عن الغرف",
      ourRooms: "غرف وأجنحة الفندق",
      roomStatusNote: "تحديثات لحظية ومباشرة لحالات الغرف من قاعدة البيانات.",
      availableForDates: "غرف متاحة من {in} إلى {out}",
      overlapNote: "تمت تصفية الغرف وفقاً للحجوزات المؤكدة وقيد التشغيل في قاعدة البيانات.",
      night: "ليلة",
      nights: "ليالي",
      total: "الإجمالي",
      bookBtn: "حجز الغرفة",
      bookedForDates: "محجوزة لهذه التواريخ",
      footerNote: "نظام إدارة الفنادق المتكامل · Node.js + Express + MySQL",
      guestAccount: "حساب ضيف جديد",
      receptionistAccount: "حساب موظف استقبال جديد",
      iAmGuest: "🧳 أنا نزيل / عميل (Guest)",
      iAmReceptionist: "🏨 أنا موظف استقبال (Receptionist)",
      employeeId: "الرقم الوظيفي (Employee ID)",
      shift: "الوردية (Shift)",
      morningShift: "صباحية (Morning)",
      eveningShift: "مسائية (Evening)",
      nightShift: "ليلية (Night)",
      welcomeBack: "مرحباً بعودتك",
      fullName: "الاسم الكامل",
      phone: "رقم الهاتف",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      alreadyHaveAccount: "لدي حساب بالفعل، تسجيل الدخول",
      createGuestAccount: "ليس لديك حساب؟ إنشاء حساب جديد",
      bookingHeader: "حجز رقم #{id}",
      modifyDates: "تعديل التواريخ",
      cancelBooking: "إلغاء الحجز",
      payOnline: "دفع أونلاين",
      orderRoomService: "طلب خدمة الغرف",
      leaveReview: "كتابة تقييم",
      checkInGuest: "تسكين النزيل (Check-In)",
      checkOutGuest: "مغادرة النزيل (Check-Out)",
      roomService: "خدمة الغرف والإضافات",
      paymentsInvoices: "المدفوعات والفواتير",
      billStatement: "تفاصيل الفاتورة والحساب",
      roomStayCost: "تكلفة حجز الغرفة",
      roomServiceCost: "خدمة الغرف والإضافات",
      paidTotal: "المدفوع",
      balanceDue: "المتبقي للدفع",
      status: "الحالة",
      arrivalToday: "القادمون اليوم للوصول",
      inHouseGuests: "النزلاء المقيمون حالياً",
      upcomingStays: "الحجوزات المؤكدة القادمة",
      roomInventory: "لوحة حالة الغرف",
      updateStatus: "تعديل الحالة",
      save: "حفظ",
      auditLog: "سجل العمليات على الغرف (Audit Log)",
      chatTitle: "المساعد الذكي لفندق نايل هاوس",
      chatDesc: "يجيب فوراً بالأسعار والغرف المتاحة وحجوزاتك من الداتابيز، ويحولك للاستقبال عند الطلب.",
      askDeskBtn: "🛎️ تحويل لموظف الاستقبال",
      send: "إرسال",
      chatPlaceholder: "اسأل عن الأسعار، الغرف المتاحة، مواعيد الوصول، أو تفاصيل حجزك...",
      escalatedChatsTitle: "رسائل النزلاء المحولة للاستقبال",
      replyToGuest: "الرد على النزيل",
      typeYourReply: "اكتب ردك للنزيل كموظف استقبال...",
      sendReply: "إرسال الرد",
      customizeStay: "تخصيص إقامتك وخدمات الغرفة",
      mealPlanTitle: "🍽️ اختيار نظام الوجبات (Meal Plan)",
      roomOnly: "إقامة فقط بدون وجبات",
      breakfastIncluded: "شامل وجبة الإفطار يومياً",
      halfBoard: "شامل إفطار وغداء يومياً (Half Board)",
      amenitiesTitle: "✨ خدمات ورفاهيات إضافية (Add-ons)",
      jacuzziOption: "جاكوزي خاص مجهز داخل الغرفة",
      sonyOption: "جهاز بلايستيشن / سوني مع ألعاب في الغرفة",
      tourGuideOption: "مرشد سياحي خاص لجولة في معالم القاهرة",
      confirmPayOnline: "💳 تأكيد الحجز ودفع إلكتروني الآن",
      confirmPayDesk: "🏨 تأكيد الحجز والدفع عند الوصول بالفندق",
      close: "إغلاق",
      perNight: "في الليلة",
      once: "مرة واحدة",
      egp: "ج.م"
    },
    en: {
      brand: "Nile House",
      tagline: "A tranquil stay on the Nile riverfront",
      myStays: "My Stays",
      assistant: "Assistant",
      desk: "Front Desk",
      rooms: "Rooms Board",
      messages: "Guest Messages",
      signIn: "Sign In",
      register: "Register",
      signOut: "Sign Out",
      heroEyebrow: "Cairo · Nile Corniche",
      heroTitle: "Stay where the morning is slow.",
      heroLede: "Search by your travel dates to discover available rooms, rates, and customized add-on services.",
      tonightInHouse: "Tonight in the house",
      occupiedRooms: "rooms currently occupied",
      totalRoomsCount: "rooms total · Singles, Doubles, and Luxury Suites",
      checkIn: "Check In Date",
      checkOut: "Check Out Date",
      roomType: "Room Type",
      anyType: "Any",
      single: "Single Room",
      double: "Double Room",
      suite: "Luxury Suite",
      searchRooms: "Search Rooms",
      ourRooms: "Our Rooms & Suites",
      roomStatusNote: "Live room inventory and physical states directly from the database.",
      availableForDates: "Available Rooms for {in} to {out}",
      overlapNote: "Filtered against overlapping confirmed and active reservations in the database.",
      night: "night",
      nights: "nights",
      total: "Total",
      bookBtn: "Book Room",
      bookedForDates: "Booked for these dates",
      footerNote: "Connected to Node.js + Express + MySQL Full-Stack System",
      guestAccount: "Guest Account Registration",
      receptionistAccount: "Receptionist Account Registration",
      iAmGuest: "🧳 I am a Guest",
      iAmReceptionist: "🏨 I am a Receptionist",
      employeeId: "Employee ID",
      shift: "Work Shift",
      morningShift: "Morning",
      eveningShift: "Evening",
      nightShift: "Night",
      welcomeBack: "Welcome Back",
      fullName: "Full Name",
      phone: "Phone Number",
      email: "Email Address",
      password: "Password",
      alreadyHaveAccount: "I already have an account, Sign In",
      createGuestAccount: "Need an account? Create guest account",
      bookingHeader: "Booking #{id}",
      modifyDates: "Modify Dates",
      cancelBooking: "Cancel Booking",
      payOnline: "Pay Online",
      orderRoomService: "Order Room Service",
      leaveReview: "Leave Review",
      checkInGuest: "Check In Guest",
      checkOutGuest: "Check Out Guest",
      roomService: "Room Service & Add-ons",
      paymentsInvoices: "Payments & Invoices",
      billStatement: "Bill Statement",
      roomStayCost: "Room Accommodation",
      roomServiceCost: "Room Service & Add-ons",
      paidTotal: "Amount Paid",
      balanceDue: "Balance Due",
      status: "Status",
      arrivalToday: "Arrivals Today",
      inHouseGuests: "In-House Guests",
      upcomingStays: "Upcoming Confirmed Stays",
      roomInventory: "Room Inventory & State",
      updateStatus: "Update State",
      save: "Save",
      auditLog: "Room Status Audit Log",
      chatTitle: "Nile House AI Assistant",
      chatDesc: "Answers directly from MySQL for prices, rooms, and bookings. Escalates to staff upon request.",
      askDeskBtn: "🛎️ Transfer to Receptionist",
      send: "Send",
      chatPlaceholder: "Ask about room rates, availability, or your own reservation...",
      escalatedChatsTitle: "Escalated Guest Messages",
      replyToGuest: "Reply to Guest",
      typeYourReply: "Type your message as receptionist...",
      sendReply: "Send Reply",
      customizeStay: "Customize Your Stay & Services",
      mealPlanTitle: "🍽️ Choose Meal Plan",
      roomOnly: "Room accommodation only",
      breakfastIncluded: "Complimentary breakfast included daily",
      halfBoard: "Breakfast and lunch included daily (Half Board)",
      amenitiesTitle: "✨ Extra Amenities & Services (Add-ons)",
      jacuzziOption: "Private Jacuzzi setup in room",
      sonyOption: "Sony PlayStation console in room with games",
      tourGuideOption: "Private licensed tour guide for Cairo excursions",
      confirmPayOnline: "💳 Confirm & Pay Online Now",
      confirmPayDesk: "🏨 Confirm & Pay Upon Arrival",
      close: "Close",
      perNight: "per night",
      once: "per stay",
      egp: "EGP"
    }
  };

  // State Management
  var state = {
    lang: localStorage.getItem('nile_lang') || 'ar',
    view: 'home',
    search: { checkIn: todayISO(), checkOut: shiftDate(2), type: 'Any' },
    searchRooms: null,
    selectedRoom: null,
    bookingModalOpen: false,
    selectedMeal: 'none',
    selectedAddons: {},
    reservationId: null,
    activeChatId: null,
    authRole: 'guest',
    authMode: 'login',
    panel: '',
    error: '',
    notice: '',
    loading: false,
    roomsList: [],
    myStays: [],
    currentStay: null,
    deskBoard: null,
    roomLogs: [],
    chatHistory: [],
    escalatedChats: [],
    menuList: []
  };

  // Curated Hotel Room Imagery
  var ROOM_IMAGES = {
    Single: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=700&q=80",
    Double: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=700&q=80",
    Suite:  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=700&q=80"
  };

  function t(key, vars) {
    var dict = I18N[state.lang] || I18N.ar;
    var str = dict[key] || I18N.en[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        str = str.replace('{' + k + '}', vars[k]);
      });
    }
    return str;
  }

  function toggleLang() {
    state.lang = state.lang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('nile_lang', state.lang);
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    render();
  }

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

  function money(n) {
    return Number(n || 0).toFixed(2) + ' ' + t('egp');
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
    state.bookingModalOpen = false;
    if (extra) {
      Object.keys(extra).forEach(function (k) { state[k] = extra[k]; });
    }
    render();
    window.scrollTo(0, 0);
    loadViewData();
  }

  function pill(status) {
    var clean = String(status || '').trim();
    return '<span class="pill ' + esc(clean) + '">' + esc(clean) + '</span>';
  }

  function shell(inner) {
    var user = me();
    var links = '';
    if (user && user.role === 'guest') {
      links = '<button data-go="stays">' + t('myStays') + '</button>' +
              '<button data-go="chat">' + t('assistant') + '</button>';
    } else if (user && user.role === 'receptionist') {
      links = '<button data-go="desk">' + t('desk') + '</button>' +
              '<button data-go="rooms">' + t('rooms') + '</button>' +
              '<button data-go="messages">' + t('messages') + '</button>';
    } else {
      links = '<button class="btn-line" data-auth-entry="guest">🧳 ' + (state.lang === 'ar' ? 'أنا عميل' : 'Guest') + '</button>' +
              '<button class="btn" data-auth-entry="receptionist">🏨 ' + (state.lang === 'ar' ? 'أنا ريسبشن' : 'Receptionist') + '</button>';
    }

    var who = user
      ? '<span class="who"><strong>' + esc(user.name) + '</strong> (' + esc(user.role) + ')</span>' +
        '<button data-act="logout">' + t('signOut') + '</button>'
      : '';

    var langLabel = state.lang === 'ar' ? '🌐 English' : '🌐 العربية';
    var langBtn = '<button class="lang-btn" data-act="toggle-lang">' + langLabel + '</button>';

    var banner = '';
    if (state.notice) banner += '<div class="banner">' + esc(state.notice) + '</div>';
    if (state.error) banner += '<div class="banner bad">' + esc(state.error) + '</div>';

    return '<header class="wrap top">' +
      '<button class="brand" data-go="home">' +
        '<strong>' + t('brand') + '</strong>' +
        '<span>' + t('tagline') + '</span>' +
      '</button>' +
      '<nav class="nav">' + links + who + langBtn + '</nav>' +
    '</header>' +
    '<main class="wrap">' + banner + inner + '</main>' +
    '<footer class="wrap foot">' +
      '<span>' + t('footerNote') + '</span>' +
      '<span>Nile House Luxury Hotel © 2026</span>' +
    '</footer>' +
    renderBookingModal();
  }

  function searchForm() {
    var s = state.search;
    return '<form class="search" data-form="search">' +
      '<label>' + t('checkIn') + '<input type="date" name="checkIn" required value="' + esc(s.checkIn) + '" min="' + esc(todayISO()) + '"></label>' +
      '<label>' + t('checkOut') + '<input type="date" name="checkOut" required value="' + esc(s.checkOut) + '" min="' + esc(shiftDate(1)) + '"></label>' +
      '<label>' + t('roomType') + '<select name="type">' +
        '<option value="Any"' + (s.type === 'Any' ? ' selected' : '') + '>' + t('anyType') + '</option>' +
        '<option value="Single"' + (s.type === 'Single' ? ' selected' : '') + '>' + t('single') + '</option>' +
        '<option value="Double"' + (s.type === 'Double' ? ' selected' : '') + '>' + t('double') + '</option>' +
        '<option value="Suite"' + (s.type === 'Suite' ? ' selected' : '') + '>' + t('suite') + '</option>' +
      '</select></label>' +
      '<button class="btn" type="submit">' + t('searchRooms') + '</button>' +
    '</form>';
  }

  function roomCard(room, bookable) {
    var imgUrl = ROOM_IMAGES[room.type] || ROOM_IMAGES.Single;
    var action = '';
    if (bookable) {
      if (room.isAvailableForDates) {
        action = '<button class="btn" data-act="open-book-modal" data-room="' + room.room_id + '">' + t('bookBtn') + ' (' + money(room.totalStayPrice) + ')</button>';
      } else {
        action = '<button class="btn" disabled>' + t('bookedForDates') + '</button>';
      }
    }
    return '<article class="card">' +
      '<div>' +
        '<div class="swatch" style="background-image: url(\'' + imgUrl + '\');">' +
          '<span class="swatch-badge">' + esc(room.type) + '</span>' +
          '<em>#' + esc(room.room_number) + '</em>' +
        '</div>' +
        '<h3>' + esc(room.type) + ' #' + esc(room.room_number) + '</h3>' +
        '<div class="meta">' +
          '<span><strong>' + money(room.price_per_night) + '</strong> / ' + t('night') + '</span>' +
          pill(room.status) +
        '</div>' +
        (room.nights ? '<p class="note">' + room.nights + ' ' + (room.nights > 1 ? t('nights') : t('night')) + ' · ' + t('total') + ': ' + money(room.totalStayPrice) + '</p>' : '') +
      '</div>' +
      action +
    '</article>';
  }

  // View: Home
  function viewHome() {
    var rooms = state.roomsList || [];
    var occupiedCount = rooms.filter(function (r) { return r.status === 'Occupied'; }).length;

    var portalBanner = '';
    if (!me()) {
      portalBanner = '<div class="panel" style="margin-top: 14px; margin-bottom: 22px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; border-left: 6px solid var(--pine); background: #fdfbf7;">' +
        '<div>' +
          '<strong style="font-size:1.05rem; display:block;">' + (state.lang === 'ar' ? 'بوابة الدخول وإنشاء الحسابات:' : 'Account Portal & Login:') + '</strong>' +
          '<span class="note">' + (state.lang === 'ar' ? 'اختر صفتك للدخول أو إنشاء حساب جديد (نزيل أو موظف استقبال)' : 'Choose your role to sign in or create a new account (Guest or Receptionist)') + '</span>' +
        '</div>' +
        '<div style="display:flex; gap:10px;">' +
          '<button class="btn-line" data-auth-entry="guest">' + t('iAmGuest') + '</button>' +
          '<button class="btn" data-auth-entry="receptionist">' + t('iAmReceptionist') + '</button>' +
        '</div>' +
      '</div>';
    }

    return '<section class="hero">' +
      '<div>' +
        '<p class="eyebrow">' + t('heroEyebrow') + '</p>' +
        '<h1>' + t('heroTitle') + '</h1>' +
        '<p class="lede">' + t('heroLede') + '</p>' +
      '</div>' +
      '<aside class="hero-card">' +
        '<span>' + t('tonightInHouse') + '</span>' +
        '<strong>' + occupiedCount + ' ' + t('occupiedRooms') + '</strong>' +
        '<span>' + rooms.length + ' ' + t('totalRoomsCount') + '</span>' +
      '</aside>' +
    '</section>' +
    portalBanner +
    searchForm() +
    '<section class="section">' +
      '<h2>' + t('ourRooms') + '</h2>' +
      '<p class="note">' + t('roomStatusNote') + '</p>' +
      '<div class="grid">' +
        (rooms.length ? rooms.map(function (r) { return roomCard(r, false); }).join('') : '<p class="note">Loading...</p>') +
      '</div>' +
    '</section>';
  }

  // View: Search Results
  function viewResults() {
    var rooms = state.searchRooms || [];
    var title = t('availableForDates', { in: esc(state.search.checkIn), out: esc(state.search.checkOut) });
    return '<section class="section">' +
      '<h2>' + title + '</h2>' +
      '<p class="note">' + t('overlapNote') + '</p>' +
    '</section>' +
    searchForm() +
    '<div class="grid">' +
      (rooms.length ? rooms.map(function (r) { return roomCard(r, true); }).join('') : '<p class="note">No rooms match your search.</p>') +
    '</div>';
  }

  // View: Auth Card with Role Switcher (Guest vs Receptionist) & Mode Switcher (Login vs Register)
  function authCard() {
    var isRegister = state.authMode === 'register';
    var isReceptionist = state.authRole === 'receptionist';

    var roleTabs = '<div class="role-tabs">' +
      '<button type="button" class="role-tab-btn' + (!isReceptionist ? ' active' : '') + '" data-set-role="guest">' +
        t('iAmGuest') +
      '</button>' +
      '<button type="button" class="role-tab-btn' + (isReceptionist ? ' active' : '') + '" data-set-role="receptionist">' +
        t('iAmReceptionist') +
      '</button>' +
    '</div>';

    var modeTabs = '<div class="mode-tabs">' +
      '<button type="button" class="mode-tab-btn' + (!isRegister ? ' active' : '') + '" data-set-mode="login">' +
        t('signIn') +
      '</button>' +
      '<button type="button" class="mode-tab-btn' + (isRegister ? ' active' : '') + '" data-set-mode="register">' +
        t('register') +
      '</button>' +
    '</div>';

    var registerFields = '';
    if (isRegister) {
      registerFields = '<label>' + t('fullName') + '<input name="name" required placeholder="Omar Hassan"></label>';
      if (isReceptionist) {
        registerFields += '<label>' + t('employeeId') + '<input type="number" name="employeeId" required placeholder="e.g. 1001"></label>' +
          '<label>' + t('shift') + '<select name="shift">' +
            '<option value="Morning">' + t('morningShift') + '</option>' +
            '<option value="Evening">' + t('eveningShift') + '</option>' +
            '<option value="Night">' + t('nightShift') + '</option>' +
          '</select></label>';
      } else {
        registerFields += '<label>' + t('phone') + '<input name="phone" required placeholder="01001234567"></label>';
      }
    }

    var heading = isRegister
      ? (isReceptionist ? t('receptionistAccount') : t('guestAccount'))
      : (isReceptionist ? 'تسجيل دخول موظف الاستقبال' : t('welcomeBack'));

    return '<section class="section" style="max-width: 500px; margin: 30px auto;">' +
      '<div class="panel stack">' +
        roleTabs +
        modeTabs +
        '<form class="stack" data-form="auth-form">' +
          '<input type="hidden" name="role" value="' + (isReceptionist ? 'receptionist' : 'guest') + '">' +
          '<input type="hidden" name="mode" value="' + (isRegister ? 'register' : 'login') + '">' +
          '<h2 style="font-size: 1.55rem; margin-bottom: 4px;">' + heading + '</h2>' +
          registerFields +
          '<label>' + t('email') + '<input type="email" name="email" required placeholder="name@example.com"></label>' +
          '<label>' + t('password') + '<input type="password" name="password" required minlength="4" placeholder="••••••••"></label>' +
          '<button class="btn" type="submit" style="margin-top: 8px;">' + (isRegister ? t('register') : t('signIn')) + '</button>' +
        '</form>' +
      '</div>' +
    '</section>';
  }

  // View: My Stays (Guest)
  function viewStays() {
    var stays = state.myStays || [];
    var rows = stays.length ? stays.map(function (stay) {
      return '<tr>' +
        '<td><strong>#' + stay.reservation_id + '</strong></td>' +
        '<td>Room ' + esc(stay.room_number) + ' (' + esc(stay.room_type) + ')</td>' +
        '<td>' + esc(stay.check_in_date) + ' → ' + esc(stay.check_out_date) + '</td>' +
        '<td>' + pill(stay.status) + '</td>' +
        '<td>' + money(stay.balance) + '</td>' +
        '<td><button class="btn-line" data-go="booking" data-id="' + stay.reservation_id + '">فتح التفاصيل</button></td>' +
      '</tr>';
    }).join('') : '<tr><td colspan="6">لا توجد حجوزات سابقة. ابحث عن غرفة في الصفحة الرئيسية لحجز إقامتك!</td></tr>';

    return '<section class="section">' +
      '<h2>' + t('myStays') + '</h2>' +
      '<table>' +
        '<thead>' +
          '<tr><th>' + t('status') + '</th><th>' + t('rooms') + '</th><th>المواعيد</th><th>الحالة</th><th>المتبقي</th><th></th></tr>' +
        '</thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table>' +
    '</section>';
  }

  // View: Single Booking
  function viewBooking() {
    var user = me();
    var stay = state.currentStay;
    if (!stay) return '<section class="section"><h2>جاري تحميل تفاصيل الحجز...</h2></section>';

    var b = stay.bill || {};
    var isOwner = user && (user.userId === stay.guest_id || user.role === 'receptionist');
    if (!isOwner) return '<section class="section"><h2>غير مسموح بعرض هذا الحجز.</h2></section>';

    var guestBits = '';
    if (user.role === 'guest') {
      if (stay.status === 'Pending' || stay.status === 'Confirmed') {
        if (b.balance > 0) {
          guestBits += '<button class="btn" data-panel="pay">' + t('payOnline') + ' (' + money(b.balance) + ')</button>';
        }
        guestBits += '<button class="btn-line" data-panel="modify">' + t('modifyDates') + '</button>' +
                     '<button class="btn-line danger" data-act="cancel-booking" data-id="' + stay.reservation_id + '">' + t('cancelBooking') + '</button>';
      }
      if (stay.status === 'Checked-In') {
        guestBits += '<button class="btn" data-panel="service">' + t('orderRoomService') + '</button>';
      }
      if ((stay.status === 'Checked-Out' || stay.status === 'Completed' || stay.status === 'COMPLETED') && !stay.review) {
        guestBits += '<button class="btn" data-panel="review">' + t('leaveReview') + '</button>';
      }
    }

    var deskBits = '';
    if (user.role === 'receptionist') {
      if (stay.status === 'Confirmed') {
        deskBits += '<button class="btn" data-act="desk-check-in" data-id="' + stay.reservation_id + '">' + t('checkInGuest') + '</button>';
      }
      if (stay.status === 'Checked-In') {
        deskBits += '<button class="btn" data-panel="desk-checkout">' + t('checkOutGuest') + '</button>';
      }
    }

    var panelHtml = '';
    if (state.panel === 'pay') {
      panelHtml = '<form class="panel stack" data-form="pay-online">' +
        '<h3>' + t('payOnline') + ' · ' + money(b.balance) + '</h3>' +
        '<label>رقم البطاقة (Card Number)<input name="card" placeholder="4242 4242 4242 4242" required></label>' +
        '<button class="btn" type="submit">تأكيد الدفع</button>' +
      '</form>';
    } else if (state.panel === 'modify') {
      panelHtml = '<form class="panel stack" data-form="modify-dates">' +
        '<h3>تعديل مواعيد الحجز</h3>' +
        '<label>تاريخ الوصول الجديد<input type="date" name="newCheckInDate" required value="' + esc(stay.check_in_date) + '" min="' + esc(todayISO()) + '"></label>' +
        '<label>تاريخ المغادرة الجديد<input type="date" name="newCheckOutDate" required value="' + esc(stay.check_out_date) + '"></label>' +
        '<button class="btn" type="submit">تحديث الحجز</button>' +
      '</form>';
    } else if (state.panel === 'service') {
      var menuList = state.menuList || [];
      var itemsHtml = menuList.map(function (item) {
        return '<label>' + esc(item.name) + ' (' + money(item.price) + ')' +
          '<input type="number" name="qty_' + item.id + '" data-price="' + item.price + '" data-name="' + esc(item.name) + '" min="0" max="10" value="0">' +
        '</label>';
      }).join('');
      panelHtml = '<form class="panel stack" data-form="order-service">' +
        '<h3>طلب خدمة الغرف</h3>' + itemsHtml +
        '<button class="btn" type="submit">إرسال الطلب</button>' +
      '</form>';
    } else if (state.panel === 'review') {
      panelHtml = '<form class="panel stack" data-form="submit-review">' +
        '<h3>تقييم الإقامة</h3>' +
        '<label>التقييم' +
          '<select name="rating"><option value="5">⭐⭐⭐⭐⭐ 5 - ممتاز</option><option value="4">⭐⭐⭐⭐ 4 - جيد جداً</option><option value="3">⭐⭐⭐ 3 - متوسط</option><option value="2">⭐⭐ 2 - مقبول</option><option value="1">⭐ 1 - سيء</option></select>' +
        '</label>' +
        '<label>التعليق<textarea name="comment" placeholder="شاركنا تجربتك في فندق نايل هاوس..."></textarea></label>' +
        '<button class="btn" type="submit">إرسال التقييم</button>' +
      '</form>';
    } else if (state.panel === 'desk-checkout') {
      panelHtml = '<form class="panel stack" data-form="process-checkout">' +
        '<h3>إتمام مغادرة النزيل (Check-Out)</h3>' +
        '<p>المبلغ المستحق: <strong>' + money(b.balance) + '</strong></p>' +
        (b.balance > 0 ? '<label>طريقة الدفع<select name="method"><option>Credit Card</option><option>Cash</option></select></label>' : '') +
        '<button class="btn" type="submit">إتمام المغادرة وطباعة الفاتورة</button>' +
      '</form>';
    }

    var ordersHtml = stay.orders && stay.orders.length ? stay.orders.map(function (o) {
      var cancelBtn = (user.role === 'guest' && o.status === 'Placed')
        ? ' <button class="btn-line danger" data-act="cancel-order" data-id="' + o.order_id + '">إلغاء</button>'
        : '';
      var deliverBtn = (user.role === 'receptionist' && o.status === 'Placed')
        ? ' <button class="btn-line" data-act="deliver-order" data-id="' + o.order_id + '">تم التوصيل</button>'
        : '';
      return '<div class="list-row">' +
        '<span>' + esc(o.items) + ' · ' + pill(o.status) + cancelBtn + deliverBtn + '</span>' +
        '<span>' + money(o.total_price) + '</span>' +
      '</div>';
    }).join('') : '<p class="note">لا توجد طلبات خدمة غرف أو إضافات.</p>';

    var paymentsHtml = stay.payments && stay.payments.length ? stay.payments.map(function (p) {
      return '<div class="list-row">' +
        '<span>' + esc(p.method) + ' · ' + pill(p.status) + (p.gateway_ref ? ' (' + esc(p.gateway_ref) + ')' : '') + '</span>' +
        '<span>' + money(p.amount) + '</span>' +
      '</div>';
    }).join('') : '<p class="note">لا توجد مدفوعات مسجلة بعد.</p>';

    var reviewHtml = stay.review
      ? '<div style="margin-top:14px; padding:12px; background:#fff; border-radius:12px; border:1px solid var(--line);">' +
          '<strong>التقييم: ' + stay.review.rating + '/5 ⭐</strong>' +
          '<p>' + esc(stay.review.comment || 'بدون تعليق مكتوب.') + '</p>' +
        '</div>'
      : '';

    return '<section class="section">' +
      '<p class="eyebrow">' + t('bookingHeader', { id: stay.reservation_id }) + '</p>' +
      '<h2>' + esc(stay.guest_name) + ' · غرفة ' + esc(stay.room_number) + ' (' + esc(stay.room_type) + ')</h2>' +
      '<p>' + esc(stay.check_in_date) + ' → ' + esc(stay.check_out_date) + ' · ' + t('status') + ': ' + pill(stay.status) + '</p>' +
      '<div class="row-actions">' + guestBits + deskBits + '</div>' +
    '</section>' +
    '<div class="split">' +
      '<div class="stack">' +
        '<div class="panel"><h3>' + t('roomService') + '</h3>' + ordersHtml + '</div>' +
        '<div class="panel"><h3>' + t('paymentsInvoices') + '</h3>' + paymentsHtml + reviewHtml + '</div>' +
        panelHtml +
      '</div>' +
      '<aside class="bill">' +
        '<h3>' + t('billStatement') + '</h3>' +
        '<div><span>' + t('roomStayCost') + '</span><span>' + money(b.roomTotal) + '</span></div>' +
        '<div><span>' + t('roomServiceCost') + '</span><span>' + money(b.serviceTotal) + '</span></div>' +
        '<div><span>' + t('paidTotal') + '</span><span>' + money(b.amountPaid) + '</span></div>' +
        '<div class="due"><span>' + t('balanceDue') + '</span><span>' + money(b.balance) + '</span></div>' +
      '</aside>' +
    '</div>';
  }

  // View: Desk Board
  function viewDesk() {
    var board = state.deskBoard || { arrivals: [], inHouse: [], upcoming: [] };

    function renderTable(list, type) {
      if (!list || !list.length) return '<p class="note">لا يوجد في هذا القسم حالياً.</p>';
      return '<table><tbody>' + list.map(function (s) {
        var act = '';
        if (type === 'arrivals') {
          act = '<button class="btn" data-act="desk-check-in" data-id="' + s.reservation_id + '">' + t('checkInGuest') + '</button>';
        } else if (type === 'inHouse') {
          act = '<button class="btn-line" data-go="booking" data-id="' + s.reservation_id + '">' + t('checkOutGuest') + '</button>';
        } else {
          act = '<button class="btn-line" data-go="booking" data-id="' + s.reservation_id + '">عرض</button>';
        }
        return '<tr>' +
          '<td><strong>#' + s.reservation_id + '</strong> ' + esc(s.guest_name) + '</td>' +
          '<td>غرفة ' + esc(s.room_number) + ' (' + esc(s.type) + ')</td>' +
          '<td>' + esc(s.check_in_date) + ' → ' + esc(s.check_out_date) + '</td>' +
          '<td>' + pill(s.status) + '</td>' +
          '<td>' + act + '</td>' +
        '</tr>';
      }).join('') + '</tbody></table>';
    }

    return '<section class="section">' +
      '<h2>' + t('desk') + '</h2>' +
      '<div class="stack">' +
        '<div class="panel"><h3>' + t('arrivalToday') + '</h3>' + renderTable(board.arrivals, 'arrivals') + '</div>' +
        '<div class="panel"><h3>' + t('inHouseGuests') + '</h3>' + renderTable(board.inHouse, 'inHouse') + '</div>' +
        '<div class="panel"><h3>' + t('upcomingStays') + '</h3>' + renderTable(board.upcoming, 'upcoming') + '</div>' +
      '</div>' +
    '</section>';
  }

  // View: Rooms Board
  function viewRooms() {
    var rooms = state.roomsList || [];
    var logs = state.roomLogs || [];

    var rows = rooms.map(function (r) {
      return '<tr>' +
        '<td><strong>غرفة ' + esc(r.room_number) + '</strong></td>' +
        '<td>' + esc(r.type) + '</td>' +
        '<td>' + money(r.price_per_night) + '</td>' +
        '<td>' + pill(r.status) + '</td>' +
        '<td>' +
          '<form data-form="update-room-status" style="display:flex; gap:8px;">' +
            '<input type="hidden" name="roomId" value="' + r.room_id + '">' +
            '<select name="newStatus">' +
              '<option' + (r.status === 'Available' ? ' selected' : '') + '>Available</option>' +
              '<option' + (r.status === 'Occupied' ? ' selected' : '') + '>Occupied</option>' +
              '<option' + (r.status === 'Dirty' ? ' selected' : '') + '>Dirty</option>' +
            '</select>' +
            '<button class="btn-line" type="submit">' + t('save') + '</button>' +
          '</form>' +
        '</td>' +
      '</tr>';
    }).join('');

    var logRows = logs.length ? logs.map(function (l) {
      return '<div class="list-row">' +
        '<span>غرفة ' + esc(l.room_number) + ' → ' + pill(l.new_status) + '</span>' +
        '<span class="note">' + esc(l.receptionist_name) + ' (ID: ' + esc(l.employee_id) + ') · ' + esc(l.updated_at) + '</span>' +
      '</div>';
    }).join('') : '<p class="note">لا توجد تحديثات سابقة.</p>';

    return '<section class="section">' +
      '<h2>' + t('roomInventory') + '</h2>' +
      '<table>' +
        '<thead><tr><th>الغرفة</th><th>النوع</th><th>السعر / ليلة</th><th>الحالة الحالية</th><th>' + t('updateStatus') + '</th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table>' +
    '</section>' +
    '<section class="section panel">' +
      '<h3>' + t('auditLog') + '</h3>' + logRows +
    '</section>';
  }

  // View: Chatbot Assistant (Sequence 2)
  function viewChat() {
    var history = state.chatHistory || [];

    var bubblesHtml = history.length ? history.map(function (c) {
      var botBubble = '<div class="bubble ' + (c.receptionist_id ? 'Receptionist' : 'Bot') + '">' +
        '<small>' + (c.receptionist_id ? '🏨 موظف الاستقبال (' + esc(c.receptionist_name || 'Staff') + ')' : '🤖 المساعد الآلي للفندق') + '</small>' +
        esc(c.response) +
      '</div>';

      return '<div class="bubble Guest"><small>أنت (النزيل)</small>' + esc(c.message) + '</div>' + botBubble;
    }).join('') : '<div class="bubble Bot"><small>🤖 المساعد الآلي للفندق</small>مرحباً بك! أنا مساعد فندق نايل هاوس الذكي. اسألني عن أسعار الغرف وأنواعها، الغرف المتاحة، أو تفاصيل حجزك وسأجيبك فوراً من قاعدة البيانات. وإذا احتجت موظف الاستقبال، سأحولك إليه في أي لحظة.</div>';

    return '<section class="section">' +
      '<h2>' + t('chatTitle') + '</h2>' +
      '<p class="note">' + t('chatDesc') + '</p>' +
      '<div class="thread" id="chatThread">' + bubblesHtml + '</div>' +
      '<form class="composer" data-form="send-chat">' +
        '<input name="message" placeholder="' + t('chatPlaceholder') + '" required autocomplete="off">' +
        '<button class="btn" type="submit">' + t('send') + '</button>' +
      '</form>' +
      '<div style="margin-top:12px; display:flex; gap:10px;">' +
        '<button class="btn-line" type="button" data-act="escalate-desk">' + t('askDeskBtn') + '</button>' +
      '</div>' +
    '</section>';
  }

  // View: Messages (Receptionist)
  function viewMessages() {
    var chats = state.escalatedChats || [];
    var activeChat = chats.find(function (c) { return c.chat_id === state.activeChatId; }) || chats[0];

    var listHtml = chats.length ? chats.map(function (c) {
      var isAct = activeChat && activeChat.chat_id === c.chat_id ? ' active' : '';
      return '<button class="' + isAct + '" data-act="select-chat" data-id="' + c.chat_id + '">' +
        '<strong>' + esc(c.guest_name) + '</strong> (' + esc(c.guest_phone) + ')<br>' +
        '<span class="note">' + esc(c.message) + '</span>' +
      '</button>';
    }).join('') : '<p class="note">لا توجد استفسارات محولة حالياً.</p>';

    var paneHtml = activeChat
      ? '<div class="panel stack">' +
          '<h3>استفسار النزيل: ' + esc(activeChat.guest_name) + ' (' + esc(activeChat.guest_phone) + ')</h3>' +
          '<div class="bubble Guest"><small>سؤال النزيل</small>' + esc(activeChat.message) + '</div>' +
          '<div class="bubble Bot"><small>الرد الحالي</small>' + esc(activeChat.response) + '</div>' +
          '<form class="stack" data-form="reply-guest-chat" data-id="' + activeChat.chat_id + '">' +
            '<label>' + t('replyToGuest') + '<textarea name="replyMessage" required placeholder="' + t('typeYourReply') + '"></textarea></label>' +
            '<button class="btn" type="submit">' + t('sendReply') + '</button>' +
          '</form>' +
        '</div>'
      : '<p class="note">اختر محادثة من القائمة للرد عليها.</p>';

    return '<section class="section">' +
      '<h2>' + t('escalatedChatsTitle') + '</h2>' +
      '<div class="split">' +
        '<div class="chat-list">' + listHtml + '</div>' +
        '<div>' + paneHtml + '</div>' +
      '</div>' +
    '</section>';
  }

  // Booking Modal with Add-ons (Meal Plan, Jacuzzi, Sony Console, Tour Guide)
  function renderBookingModal() {
    if (!state.bookingModalOpen || !state.selectedRoom) return '';
    var r = state.selectedRoom;
    var nights = r.nights || 1;
    var baseRoomCost = r.totalStayPrice || (r.price_per_night * nights);

    // Calculate Meal Cost
    var mealPricePerNight = state.selectedMeal === 'breakfast' ? 100 : (state.selectedMeal === 'halfboard' ? 250 : 0);
    var mealTotal = mealPricePerNight * nights;

    // Calculate Add-on Amenities Cost
    var addonsTotal = 0;
    if (state.selectedAddons.jacuzzi) addonsTotal += 300;
    if (state.selectedAddons.sony) addonsTotal += 200;
    if (state.selectedAddons.tour) addonsTotal += 500;

    var grandTotal = baseRoomCost + mealTotal + addonsTotal;

    return '<div class="modal-backdrop">' +
      '<div class="modal-box">' +
        '<div class="modal-header">' +
          '<h3>' + t('customizeStay') + '</h3>' +
          '<button class="modal-close" data-act="close-modal">&times;</button>' +
        '</div>' +
        '<p class="note"><strong>' + esc(r.type) + ' #' + esc(r.room_number) + '</strong> (' + esc(state.search.checkIn) + ' → ' + esc(state.search.checkOut) + ' · ' + nights + ' ' + (nights > 1 ? t('nights') : t('night')) + ')</p>' +

        '<!-- Meal Plan Selection -->' +
        '<div class="addon-group">' +
          '<div class="addon-title">' + t('mealPlanTitle') + '</div>' +
          '<div class="addon-option">' +
            '<label><input type="radio" name="mealChoice" value="none"' + (state.selectedMeal === 'none' ? ' checked' : '') + ' data-act="change-meal"> ' + t('roomOnly') + '</label>' +
            '<span class="addon-price">0 ' + t('egp') + '</span>' +
          '</div>' +
          '<div class="addon-option">' +
            '<label><input type="radio" name="mealChoice" value="breakfast"' + (state.selectedMeal === 'breakfast' ? ' checked' : '') + ' data-act="change-meal"> ' + t('breakfastIncluded') + '</label>' +
            '<span class="addon-price">+100 ' + t('egp') + ' / ' + t('night') + '</span>' +
          '</div>' +
          '<div class="addon-option">' +
            '<label><input type="radio" name="mealChoice" value="halfboard"' + (state.selectedMeal === 'halfboard' ? ' checked' : '') + ' data-act="change-meal"> ' + t('halfBoard') + '</label>' +
            '<span class="addon-price">+250 ' + t('egp') + ' / ' + t('night') + '</span>' +
          '</div>' +
        '</div>' +

        '<!-- Extra Add-ons Selection -->' +
        '<div class="addon-group">' +
          '<div class="addon-title">' + t('amenitiesTitle') + '</div>' +
          '<div class="addon-option">' +
            '<label><input type="checkbox" name="addon_jacuzzi"' + (state.selectedAddons.jacuzzi ? ' checked' : '') + ' data-act="toggle-addon" data-key="jacuzzi"> 🛁 ' + t('jacuzziOption') + '</label>' +
            '<span class="addon-price">+300 ' + t('egp') + '</span>' +
          '</div>' +
          '<div class="addon-option">' +
            '<label><input type="checkbox" name="addon_sony"' + (state.selectedAddons.sony ? ' checked' : '') + ' data-act="toggle-addon" data-key="sony"> 🎮 ' + t('sonyOption') + '</label>' +
            '<span class="addon-price">+200 ' + t('egp') + '</span>' +
          '</div>' +
          '<div class="addon-option">' +
            '<label><input type="checkbox" name="addon_tour"' + (state.selectedAddons.tour ? ' checked' : '') + ' data-act="toggle-addon" data-key="tour"> 🏛️ ' + t('tourGuideOption') + '</label>' +
            '<span class="addon-price">+500 ' + t('egp') + '</span>' +
          '</div>' +
        '</div>' +

        '<!-- Total Calculation Bar -->' +
        '<div class="modal-total-bar">' +
          '<span>' + t('total') + ' الإقامة والخدمات:</span>' +
          '<strong>' + money(grandTotal) + '</strong>' +
        '</div>' +

        '<div class="modal-actions">' +
          '<button class="btn" data-act="confirm-booking" data-pay="online">' + t('confirmPayOnline') + '</button>' +
          '<button class="btn-line" data-act="confirm-booking" data-pay="desk">' + t('confirmPayDesk') + '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  // Main Render
  function render() {
    var user = me();
    var view = state.view;

    if ((view === 'stays' || view === 'chat') && (!user || user.role !== 'guest')) view = 'login';
    if (view === 'booking' && !user) view = 'login';
    if ((view === 'desk' || view === 'rooms' || view === 'messages') && (!user || user.role !== 'receptionist')) view = 'login';

    var inner = view === 'home' ? viewHome()
      : view === 'results' ? viewResults()
      : (view === 'login' || view === 'register') ? authCard()
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

    if (view === 'chat') {
      var thread = document.getElementById('chatThread');
      if (thread) thread.scrollTop = thread.scrollHeight;
    }
  }

  // Load backend data for view
  async function loadViewData() {
    try {
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
    // Language Toggle
    var langBtn = e.target.closest('[data-act="toggle-lang"]');
    if (langBtn) {
      toggleLang();
      return;
    }

    // Navigation
    var goBtn = e.target.closest('[data-go]');
    if (goBtn) {
      var targetView = goBtn.dataset.go;
      var targetId = goBtn.dataset.id ? Number(goBtn.dataset.id) : state.reservationId;
      go(targetView, { reservationId: targetId });
      return;
    }

    // Set Auth Role (Guest vs Receptionist)
    var setRoleBtn = e.target.closest('[data-set-role]');
    if (setRoleBtn) {
      state.authRole = setRoleBtn.dataset.setRole;
      render();
      return;
    }

    // Set Auth Mode (Sign In vs Register)
    var setModeBtn = e.target.closest('[data-set-mode]');
    if (setModeBtn) {
      state.authMode = setModeBtn.dataset.setMode;
      render();
      return;
    }

    // Direct entry from home or navbar
    var authEntryBtn = e.target.closest('[data-auth-entry]');
    if (authEntryBtn) {
      state.authRole = authEntryBtn.dataset.authEntry;
      state.authMode = 'login';
      go('login');
      return;
    }

    // Sign out
    var logoutBtn = e.target.closest('[data-act="logout"]');
    if (logoutBtn) {
      API.clearSession();
      showNotice(state.lang === 'ar' ? 'تم تسجيل الخروج بنجاح.' : 'Signed out successfully.');
      go('home');
      return;
    }

    // Toggle panels in booking view
    var panelBtn = e.target.closest('[data-panel]');
    if (panelBtn) {
      state.panel = panelBtn.dataset.panel;
      clearAlerts();
      render();
      return;
    }

    // Open booking modal
    var openBookBtn = e.target.closest('[data-act="open-book-modal"]');
    if (openBookBtn) {
      var rId = Number(openBookBtn.dataset.room);
      var user = me();
      if (!user) {
        showError(state.lang === 'ar' ? 'يرجى تسجيل الدخول أو إنشاء حساب لإتمام الحجز.' : 'Please sign in or register to complete your booking.');
        go('login');
        return;
      }
      if (user.role !== 'guest') {
        showError(state.lang === 'ar' ? 'حسابات الضيوف فقط هي التي تستطيع الحجز.' : 'Only guest accounts can create bookings.');
        return;
      }

      var found = (state.searchRooms || []).find(function (r) { return r.room_id === rId; });
      if (found) {
        state.selectedRoom = found;
        state.selectedMeal = 'none';
        state.selectedAddons = {};
        state.bookingModalOpen = true;
        render();
      }
      return;
    }

    // Close booking modal
    var closeModBtn = e.target.closest('[data-act="close-modal"]');
    if (closeModBtn) {
      state.bookingModalOpen = false;
      render();
      return;
    }

    // Change meal choice in modal
    var mealRadio = e.target.closest('[data-act="change-meal"]');
    if (mealRadio) {
      state.selectedMeal = mealRadio.value;
      render();
      return;
    }

    // Toggle addon checkbox in modal
    var addonCheck = e.target.closest('[data-act="toggle-addon"]');
    if (addonCheck) {
      var key = addonCheck.dataset.key;
      state.selectedAddons[key] = addonCheck.checked;
      render();
      return;
    }

    // Confirm booking with customized add-ons
    var confirmBookBtn = e.target.closest('[data-act="confirm-booking"]');
    if (confirmBookBtn) {
      var payType = confirmBookBtn.dataset.pay;
      var payOnline = payType === 'online';
      var r = state.selectedRoom;

      var mealPlanObj = null;
      if (state.selectedMeal === 'breakfast') {
        mealPlanObj = { name: 'شامل الإفطار يومياً (Daily Breakfast)', price: 100, perNight: true };
      } else if (state.selectedMeal === 'halfboard') {
        mealPlanObj = { name: 'إقامة نصف شاملة إفطار وغداء (Half Board)', price: 250, perNight: true };
      }

      var addOnsList = [];
      if (state.selectedAddons.jacuzzi) addOnsList.push({ name: '🛁 جاكوزي خاص مجهز (Private Jacuzzi)', price: 300 });
      if (state.selectedAddons.sony) addOnsList.push({ name: '🎮 جهاز بلايستيشن / سوني (Sony PlayStation)', price: 200 });
      if (state.selectedAddons.tour) addOnsList.push({ name: '🏛️ مرشد سياحي خاص (Private Tour Guide)', price: 500 });

      try {
        var res = await API.createReservation({
          roomId: r.room_id,
          checkInDate: state.search.checkIn,
          checkOutDate: state.search.checkOut,
          payOnline: payOnline,
          mealPlan: mealPlanObj,
          addOns: addOnsList
        });

        state.bookingModalOpen = false;
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
      var confirmMsg = state.lang === 'ar'
        ? 'هل أنت متأكد من إلغاء هذا الحجز؟ إذا تم الدفع مسبقاً فسيتم استرداد المبلغ المدفوع تلقائياً.'
        : 'Are you sure you want to cancel this booking? If already paid, a refund will be processed.';
      if (!confirm(confirmMsg)) return;

      try {
        var cancelRes = await API.cancelReservation(cancelBookBtn.dataset.id);
        showNotice(cancelRes.message + (cancelRes.refundedAmount > 0 ? ' (' + money(cancelRes.refundedAmount) + ')' : ''));
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
        var chkRes = await API.checkInGuest(checkInBtn.dataset.id);
        showNotice(chkRes.message);
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
        var escRes = await API.escalateChat();
        showNotice(escRes.message);
        loadViewData();
      } catch (err) {
        showError(err.message);
      }
      return;
    }

    // Select escalated chat
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
        showNotice('تم توصيل الطلب.');
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
        showNotice('تم إلغاء الطلب.');
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
        var sRes = await API.getRooms({ checkIn: checkIn, checkOut: checkOut, type: type });
        if (sRes.success) {
          state.searchRooms = sRes.rooms;
          go('results');
        }
      } catch (err) {
        showError(err.message);
      }
      return;
    }

    // Auth Form (Login or Register for Guest or Receptionist)
    if (formType === 'auth-form' || formType === 'login' || formType === 'register') {
      var mode = form.mode ? form.mode.value : (formType === 'register' ? 'register' : 'login');
      var role = form.role ? form.role.value : state.authRole;
      var email = form.email.value;
      var password = form.password.value;

      if (mode === 'login') {
        try {
          var lRes = await API.login(email, password);
          showNotice((state.lang === 'ar' ? 'أهلاً بك، ' : 'Welcome back, ') + lRes.user.name + '!');
          if (lRes.user.role === 'receptionist') {
            go('desk');
          } else {
            go('home');
          }
        } catch (err) {
          showError(err.message);
        }
      } else {
        // Register (Guest or Receptionist)
        var name = form.name.value;
        var phone = form.phone ? form.phone.value : '';
        var employeeId = form.employeeId ? form.employeeId.value : null;
        var shift = form.shift ? form.shift.value : 'Morning';

        try {
          var regRes = await API.register(name, email, password, phone, role, employeeId, shift);
          showNotice((state.lang === 'ar' ? 'تم إنشاء الحساب بنجاح! مرحباً ' : 'Account registered successfully! Welcome ') + regRes.user.name);
          if (regRes.user.role === 'receptionist') {
            go('desk');
          } else {
            go('home');
          }
        } catch (err) {
          showError(err.message);
        }
      }
      return;
    }

    // Pay Online Form
    if (formType === 'pay-online') {
      var card = form.card.value;
      var stay = state.currentStay;
      try {
        var payRes = await API.processPayment(stay.reservation_id, stay.bill.balance, 'Online', card);
        showNotice(payRes.message);
        state.panel = '';
        loadViewData();
      } catch (err) {
        showError(err.message);
      }
      return;
    }

    // Modify Dates Form
    if (formType === 'modify-dates') {
      var newIn = form.newCheckInDate.value;
      var newOut = form.newCheckOutDate.value;
      try {
        var modRes = await API.modifyReservation(state.reservationId, newIn, newOut);
        showNotice(modRes.message);
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
          var iName = inp.dataset.name;
          var iPrice = Number(inp.dataset.price);
          selected.push(qty + 'x ' + iName);
          total += qty * iPrice;
        }
      });

      if (!selected.length) {
        showError(state.lang === 'ar' ? 'يرجى اختيار صنف واحد على الأقل.' : 'Please choose at least 1 item.');
        return;
      }

      try {
        var ordRes = await API.placeRoomServiceOrder(state.reservationId, selected, total);
        showNotice(ordRes.message);
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
        var revRes = await API.submitReview(state.reservationId, rating, comment);
        showNotice(revRes.message);
        state.panel = '';
        loadViewData();
      } catch (err) {
        showError(err.message);
      }
      return;
    }

    // Process Check-out (Receptionist)
    if (formType === 'process-checkout') {
      var method = form.method ? form.method.value : 'Credit Card';
      try {
        var coRes = await API.checkOutGuest(state.reservationId, method);
        showNotice(coRes.message);
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
        var statRes = await API.updateRoomStatus(rId, newStat);
        showNotice(statRes.message);
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

    // Reply to escalated chat (Receptionist)
    if (formType === 'reply-guest-chat') {
      var cId = form.dataset.id;
      var reply = form.replyMessage.value;
      try {
        var repRes = await API.replyToChat(cId, reply);
        showNotice(repRes.message);
        loadViewData();
      } catch (err) {
        showError(err.message);
      }
      return;
    }
  });

  // Init Language on document
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';

  // Initial Boot
  go('home');
})();
