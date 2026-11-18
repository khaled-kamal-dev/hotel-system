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
      customizeStay: "تخصيص إقامتك والخدمات الإضافية",
      allInclusiveTitle: "إقامة كاملة شاملة جميع الوجبات (All-Inclusive)",
      allInclusiveNote: "جميع الوجبات اليومية (إفطار، غداء، عشاء بوفيه مفتوح) مشمولة مجاناً في سعر الغرفة.",
      amenitiesTitle: "✨ خدمات ورفاهيات إضافية (Add-ons)",
      jacuzziOption: "جاكوزي خاص مجهز داخل الغرفة",
      sonyOption: "جهاز بلايستيشن 5 مع ألعاب في الغرفة",
      tourGuideOption: "مرشد سياحي خاص لجولة في معالم القاهرة والأهرامات",
      airportOption: "توصيل واستقبال VIP من/إلى المطار",
      spaOption: "جلسة سبا ومساج استرخائي كامل للجسم",
      paymentMethod: "طريقة الدفع",
      payOnlineOption: "دفع إلكتروني الآن بالبطاقة (Online Payment)",
      payDeskOption: "الدفع عند الوصول بالفندق (Pay at Hotel)",
      cardLabel: "رقم البطاقة الائتمانية",
      cardPlaceholder: "4242 4242 4242 4242",
      expiryLabel: "تاريخ الانتهاء",
      cvvLabel: "رمز الأمان (CVV)",
      cardValid: "رقم بطاقة صحيح ومؤكد بنجاح",
      cardInvalid: "رقم بطاقة غير صحيح (تحقق من الأرقام)",
      confirmPayOnline: "💳 تأكيد الحجز ودفع إلكتروني الآن",
      confirmPayDesk: "🏨 تأكيد الحجز والدفع عند الوصول بالفندق",
      close: "إغلاق",
      cancelBtn: "إلغاء",
      cancelItem: "إلغاء الصنف",
      showPassword: "إظهار كلمة المرور",
      hidePassword: "إخفاء كلمة المرور",
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
      allInclusiveTitle: "Full Board All-Inclusive Stay",
      allInclusiveNote: "Complimentary daily breakfast, lunch, and dinner buffet included with your room rate.",
      amenitiesTitle: "✨ Extra Amenities & Services (Add-ons)",
      jacuzziOption: "Private Jacuzzi setup in room",
      sonyOption: "Sony PlayStation console in room with games",
      tourGuideOption: "Private licensed tour guide for Cairo excursions",
      airportOption: "VIP Airport Pickup & Drop-off Service",
      spaOption: "Full Body Spa & Relaxation Massage Session",
      paymentMethod: "Payment Method",
      payOnlineOption: "Pay Online Now with Credit Card",
      payDeskOption: "Pay Upon Arrival at Hotel Desk",
      cardLabel: "Credit Card Number",
      cardPlaceholder: "4242 4242 4242 4242",
      expiryLabel: "Expiry Date",
      cvvLabel: "Security Code (CVV)",
      cardValid: "Valid credit card verified",
      cardInvalid: "Invalid card number (checksum failed)",
      confirmPayOnline: "💳 Confirm & Pay Online Now",
      confirmPayDesk: "🏨 Confirm & Pay Upon Arrival",
      close: "Close",
      cancelBtn: "Cancel",
      cancelItem: "Cancel Item",
      showPassword: "Show Password",
      hidePassword: "Hide Password",
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
    modalPayMethod: 'online',
    cardInput: '',
    expiryInput: '',
    cvvInput: '',
    selectedAddons: {},
    reservationId: null,
    chatOpen: false,
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

  // Curated Hotel Room Descriptions & Amenities
  var ROOM_DESCRIPTIONS = {
    Single: {
      ar: 'غرفة عصرية مريحة مجهزة بسرير فاخر، مكتب عمل أنيق، شاشة ذكية وحمام رخامي خاص. مثالية للمسافرين الفرديين وإقامات العمل.',
      en: 'A modern, comfortable room with a plush single bed, executive desk, smart TV, and private marble bath. Perfect for solo and business travelers.',
      tags: {
        ar: ['سرير فردي فاخر', 'مكتب عمل', 'شاشة ذكية', 'واي فاي فائق'],
        en: ['Plush Single Bed', 'Work Desk', 'Smart TV', 'Fast Wi-Fi']
      }
    },
    Double: {
      ar: 'إطلالة مباشرة ساحرة على النيل مع سرير كينج فخم، ركن جلوس هادئ، وشرفة خاصة للاسترخاء. الخيار الأمثل للأزواج وقضاء أجمل العطلات.',
      en: 'Stunning riverfront views featuring a plush king bed, cozy lounge area, and private balcony. The ultimate choice for couples and leisure vacations.',
      tags: {
        ar: ['سرير كينج مزدوج', 'إطلالة على النيل', 'شرفة خاصة', 'ركن قهوة'],
        en: ['King Size Bed', 'Nile View', 'Private Balcony', 'Coffee Station']
      }
    },
    Suite: {
      ar: 'جناح ملكي فسيح يضم غرفة نوم ماستر، صالة استقبال ومعيشة مستقلة، حمام جاكوزي خاص، وإطلالة بانورامية على كورنيش النيل مع خدمات VIP كاملة.',
      en: 'An opulent royal suite offering a master bedroom, separate living room, private Jacuzzi bath, and panoramic Nile Corniche views with full VIP hospitality.',
      tags: {
        ar: ['جناح عائلي فسيح', 'صالة استقبال', 'جاكوزي خاص', 'ضيافة VIP'],
        en: ['Spacious Suite', 'Living Lounge', 'Private Jacuzzi', 'VIP Amenities']
      }
    }
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

  // Credit Card Formatter (4 digits followed by space)
  function formatCardNumber(val) {
    var digits = String(val || '').replace(/\D/g, '').substring(0, 16);
    var parts = digits.match(/.{1,4}/g);
    return parts ? parts.join(' ') : digits;
  }

  // Luhn Checksum Algorithm Validator
  function validateLuhn(num) {
    var digits = String(num || '').replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;
    var sum = 0;
    var shouldDouble = false;
    for (var i = digits.length - 1; i >= 0; i--) {
      var d = parseInt(digits.charAt(i), 10);
      if (shouldDouble) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
      shouldDouble = !shouldDouble;
    }
    return (sum % 10) === 0;
  }

  // Detect Card Brand (Visa, Mastercard, Amex, Meeza)
  function detectCardBrand(num) {
    var clean = String(num || '').replace(/\D/g, '');
    if (/^4/.test(clean)) return { name: 'Visa', icon: '💳 🟦 Visa' };
    if (/^(5[1-5]|2[2-7])/.test(clean)) return { name: 'Mastercard', icon: '💳 🟧 Mastercard' };
    if (/^3[47]/.test(clean)) return { name: 'Amex', icon: '💳 🟩 Amex' };
    if (/^(5078|9740)/.test(clean)) return { name: 'Meeza', icon: '💳 🇪🇬 ميزة' };
    return { name: '', icon: '💳' };
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
      links = '<button data-go="stays">' + t('myStays') + '</button>';
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
    renderBookingModal() +
    renderChatWidget();
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
    var descObj = ROOM_DESCRIPTIONS[room.type] || ROOM_DESCRIPTIONS.Single;
    var descText = state.lang === 'ar' ? descObj.ar : descObj.en;
    var tags = (state.lang === 'ar' ? descObj.tags.ar : descObj.tags.en) || [];
    var tagsHtml = tags.map(function (tg) {
      return '<span class="room-tag">' + esc(tg) + '</span>';
    }).join('');

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
        '<p class="card-desc">' + descText + '</p>' +
        '<div class="room-tags">' + tagsHtml + '</div>' +
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
          '<label>' + t('password') +
            '<div class="password-wrapper">' +
              '<input type="password" name="password" required minlength="4" placeholder="••••••••" autocomplete="current-password">' +
              '<button type="button" class="password-toggle-btn" data-act="toggle-password" title="' + t('showPassword') + '" aria-label="Toggle Password Visibility">👁️</button>' +
            '</div>' +
          '</label>' +
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
      var brandObj = detectCardBrand(state.cardInput || '');
      var isLuhnValid = validateLuhn(state.cardInput || '');
      var hasCardDigits = (state.cardInput || '').replace(/\D/g, '').length >= 13;
      var feedbackText = hasCardDigits
        ? (isLuhnValid ? '✓ ' + (brandObj.name ? brandObj.name + ' - ' : '') + t('cardValid') : '✕ ' + t('cardInvalid'))
        : '';
      var feedbackClass = hasCardDigits ? (isLuhnValid ? 'valid' : 'invalid') : '';

      panelHtml = '<form class="panel stack" data-form="pay-online">' +
        '<h3>' + t('payOnline') + ' · ' + money(b.balance) + '</h3>' +
        '<div class="card-input-container">' +
          '<label>' + t('cardLabel') +
            '<div class="card-input-wrapper">' +
              '<input name="card" class="card-input" data-mask="card" placeholder="' + t('cardPlaceholder') + '" maxlength="19" value="' + esc(state.cardInput || '') + '" required>' +
              '<span class="card-brand-badge">' + brandObj.icon + '</span>' +
            '</div>' +
            '<div class="card-feedback ' + feedbackClass + '">' + feedbackText + '</div>' +
          '</label>' +
          '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-top:8px;">' +
            '<label>' + t('expiryLabel') +
              '<input name="expiry" data-mask="expiry" placeholder="MM/YY" maxlength="5" value="' + esc(state.expiryInput || '') + '" required>' +
            '</label>' +
            '<label>' + t('cvvLabel') +
              '<input name="cvv" data-mask="cvv" placeholder="123" maxlength="4" value="' + esc(state.cvvInput || '') + '" required>' +
            '</label>' +
          '</div>' +
        '</div>' +
        '<button class="btn" type="submit" style="margin-top:10px;">' + (state.lang === 'ar' ? 'تأكيد ودفع ' : 'Pay Now ') + money(b.balance) + '</button>' +
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

    var ordersHtml = '';
    if (stay.orders && stay.orders.length) {
      var rows = [];
      stay.orders.forEach(function (o) {
        var rawItems = o.items ? o.items.split(/,\s*(?=[^)]*(?:\(|$))/) : [];
        if (rawItems.length > 1 && o.status === 'Placed') {
          rawItems.forEach(function (it, idx) {
            var itemCancelBtn = (user.role === 'guest')
              ? ' <button class="btn-line danger" data-act="cancel-order-item" data-id="' + o.order_id + '" data-index="' + idx + '">' + t('cancelBtn') + '</button>'
              : '';
            var priceMatch = it.match(/\((?:EGP\s*)?(\d+(?:\.\d+)?)\)/i) || it.match(/(\d+(?:\.\d+)?)\s*(?:EGP|ج\.م)/i);
            var itemPrice = priceMatch ? Number(priceMatch[1]) : Number((Number(o.total_price) / rawItems.length).toFixed(2));
            rows.push('<div class="list-row">' +
              '<span>' + esc(it) + ' · ' + pill(o.status) + itemCancelBtn + '</span>' +
              '<span>' + money(itemPrice) + '</span>' +
            '</div>');
          });
        } else {
          var cancelBtn = (user.role === 'guest' && o.status === 'Placed')
            ? ' <button class="btn-line danger" data-act="cancel-order" data-id="' + o.order_id + '">' + t('cancelBtn') + '</button>'
            : '';
          var deliverBtn = (user.role === 'receptionist' && o.status === 'Placed')
            ? ' <button class="btn-line" data-act="deliver-order" data-id="' + o.order_id + '">' + (state.lang === 'ar' ? 'تم التوصيل' : 'Delivered') + '</button>'
            : '';
          rows.push('<div class="list-row">' +
            '<span>' + esc(o.items) + ' · ' + pill(o.status) + cancelBtn + deliverBtn + '</span>' +
            '<span>' + money(o.total_price) + '</span>' +
          '</div>');
        }
      });
      ordersHtml = rows.join('');
    } else {
      ordersHtml = '<p class="note">' + (state.lang === 'ar' ? 'لا توجد طلبات خدمة غرف أو إضافات.' : 'No room service or add-ons requested.') + '</p>';
    }

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

  // Floating Chat Widget (Bottom-right popup)
  function renderChatWidget() {
    var user = me();
    // Do not show widget for staff/receptionists (they manage chats from the messages dashboard)
    if (user && user.role === 'receptionist') return '';

    var history = state.chatHistory || [];
    var isOpen = state.chatOpen;

    // Floating Button (always visible in bottom right)
    var fab = '<button class="chat-fab" data-act="toggle-chat" title="' + t('assistant') + '">' +
      '<span class="chat-fab-icon">' + (isOpen ? '✕' : '💬') + '</span>' +
    '</button>';

    if (!isOpen) return fab;

    // If user is not signed in yet, show friendly login prompt inside the popup
    if (!user) {
      var notLoggedInMsg = state.lang === 'ar'
        ? '<div class="bubble Bot"><small>🤖 المساعد الذكي</small>مرحباً بك في فندق نايل هاوس! للتحدث مع المساعد الذكي، الاستفسار عن تفاصيل الحجز، أو التحويل للاستقبال، يرجى تسجيل الدخول أولاً.</div>'
        : '<div class="bubble Bot"><small>🤖 AI Assistant</small>Welcome to Nile House! Please sign in with your guest account to chat with the assistant and get instant answers from our database.</div>';

      var loginBtnLabel = state.lang === 'ar' ? '🧳 تسجيل الدخول أو إنشاء حساب' : '🧳 Sign In or Register';

      return fab + '<div class="chat-popup">' +
        '<div class="chat-popup-header">' +
          '<div>' +
            '<strong>' + t('chatTitle') + '</strong>' +
            '<small>' + t('chatDesc') + '</small>' +
          '</div>' +
          '<button class="chat-popup-close" data-act="toggle-chat">&times;</button>' +
        '</div>' +
        '<div class="chat-popup-body">' + notLoggedInMsg + '</div>' +
        '<div class="chat-popup-footer" style="padding: 16px;">' +
          '<button class="btn" data-auth-entry="guest" style="width:100%; text-align:center;">' + loginBtnLabel + '</button>' +
        '</div>' +
      '</div>';
    }

    // Chat popup panel for logged in guests
    var welcomeMsg = state.lang === 'ar'
      ? 'مرحباً بك ' + esc(user.name) + '! أنا مساعد فندق نايل هاوس الذكي. اسألني عن أسعار الغرف، المتاح حالياً، تفاصيل حجزك وفاتورتك، أو مواعيد الوصول وسأجيبك فوراً من قاعدة البيانات.'
      : 'Hello ' + esc(user.name) + '! I am Nile House\'s AI assistant. Ask me about room rates, availability, your booking and bill, or check-in times and I\'ll answer instantly from the database.';

    var bubblesHtml = history.length ? history.map(function (c) {
      var senderLabel = state.lang === 'ar' ? 'أنت (النزيل)' : 'You (Guest)';
      var botLabel = c.receptionist_id
        ? '🏨 ' + (state.lang === 'ar' ? 'موظف الاستقبال' : 'Receptionist') + ' (' + esc(c.receptionist_name || 'Staff') + ')'
        : '🤖 ' + (state.lang === 'ar' ? 'المساعد الآلي' : 'AI Assistant');

      var botBubble = '<div class="bubble ' + (c.receptionist_id ? 'Receptionist' : 'Bot') + '">' +
        '<small>' + botLabel + '</small>' +
        esc(c.response) +
      '</div>';

      return '<div class="bubble Guest"><small>' + senderLabel + '</small>' + esc(c.message) + '</div>' + botBubble;
    }).join('') : '<div class="bubble Bot"><small>🤖 ' + (state.lang === 'ar' ? 'المساعد الآلي' : 'AI Assistant') + '</small>' + welcomeMsg + '</div>';

    var popup = '<div class="chat-popup">' +
      '<div class="chat-popup-header">' +
        '<div>' +
          '<strong>' + t('chatTitle') + '</strong>' +
          '<small>' + t('chatDesc') + '</small>' +
        '</div>' +
        '<button class="chat-popup-close" data-act="toggle-chat">&times;</button>' +
      '</div>' +
      '<div class="chat-popup-body" id="chatThread">' + bubblesHtml + '</div>' +
      '<div class="chat-popup-footer">' +
        '<button class="btn-line chat-escalate-btn" type="button" data-act="escalate-desk">' + t('askDeskBtn') + '</button>' +
        '<form class="chat-popup-composer" data-form="send-chat">' +
          '<input name="message" placeholder="' + t('chatPlaceholder') + '" required autocomplete="off">' +
          '<button class="btn" type="submit">' + t('send') + '</button>' +
        '</form>' +
      '</div>' +
    '</div>';

    return fab + popup;
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

  // Booking Modal with Add-ons (Jacuzzi, Sony Console, Tour Guide, Airport VIP, Full Body Spa)
  function renderBookingModal() {
    if (!state.bookingModalOpen || !state.selectedRoom) return '';
    var r = state.selectedRoom;
    var nights = r.nights || 1;
    var baseRoomCost = r.totalStayPrice || (r.price_per_night * nights);

    // Calculate Add-on Amenities Cost
    var addonsTotal = 0;
    if (state.selectedAddons.jacuzzi) addonsTotal += 300;
    if (state.selectedAddons.sony) addonsTotal += 200;
    if (state.selectedAddons.tour) addonsTotal += 500;
    if (state.selectedAddons.airport) addonsTotal += 350;
    if (state.selectedAddons.spa) addonsTotal += 450;

    var grandTotal = baseRoomCost + addonsTotal;

    return '<div class="modal-backdrop">' +
      '<div class="modal-box">' +
        '<div class="modal-header">' +
          '<h3>' + t('customizeStay') + '</h3>' +
          '<button class="modal-close" data-act="close-modal">&times;</button>' +
        '</div>' +
        '<p class="note"><strong>' + esc(r.type) + ' #' + esc(r.room_number) + '</strong> (' + esc(state.search.checkIn) + ' → ' + esc(state.search.checkOut) + ' · ' + nights + ' ' + (nights > 1 ? t('nights') : t('night')) + ')</p>' +

        '<!-- All-Inclusive Included Meals Highlight -->' +
        '<div class="all-inclusive-banner">' +
          '<span class="ai-icon">🍽️</span>' +
          '<div>' +
            '<strong>' + t('allInclusiveTitle') + '</strong>' +
            '<span>' + t('allInclusiveNote') + '</span>' +
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
          '<div class="addon-option">' +
            '<label><input type="checkbox" name="addon_airport"' + (state.selectedAddons.airport ? ' checked' : '') + ' data-act="toggle-addon" data-key="airport"> 🚗 ' + t('airportOption') + '</label>' +
            '<span class="addon-price">+350 ' + t('egp') + '</span>' +
          '</div>' +
          '<div class="addon-option">' +
            '<label><input type="checkbox" name="addon_spa"' + (state.selectedAddons.spa ? ' checked' : '') + ' data-act="toggle-addon" data-key="spa"> 💆 ' + t('spaOption') + '</label>' +
            '<span class="addon-price">+450 ' + t('egp') + '</span>' +
          '</div>' +
        '</div>' +

        '<!-- Payment Method & Credit Card Details -->' +
        '<div class="addon-group">' +
          '<div class="addon-title">💳 ' + t('paymentMethod') + '</div>' +
          '<div class="addon-option">' +
            '<label><input type="radio" name="modalPayMethod" value="online"' + (state.modalPayMethod !== 'desk' ? ' checked' : '') + ' data-act="change-modal-pay"> 💳 ' + t('payOnlineOption') + '</label>' +
          '</div>' +
          '<div class="addon-option">' +
            '<label><input type="radio" name="modalPayMethod" value="desk"' + (state.modalPayMethod === 'desk' ? ' checked' : '') + ' data-act="change-modal-pay"> 🏨 ' + t('payDeskOption') + '</label>' +
          '</div>' +

          (state.modalPayMethod !== 'desk' ? (function () {
            var brandObj = detectCardBrand(state.cardInput || '');
            var isLuhnValid = validateLuhn(state.cardInput || '');
            var hasCardDigits = (state.cardInput || '').replace(/\D/g, '').length >= 13;
            var feedbackText = hasCardDigits
              ? (isLuhnValid ? '✓ ' + (brandObj.name ? brandObj.name + ' - ' : '') + t('cardValid') : '✕ ' + t('cardInvalid') + ' (جرّب 4242 4242 4242 4242)')
              : (state.lang === 'ar' ? 'ℹ️ بطاقة اختبار تجريبية: 4242 4242 4242 4242' : 'ℹ️ Demo card: 4242 4242 4242 4242');
            var feedbackClass = hasCardDigits ? (isLuhnValid ? 'valid' : 'invalid') : 'note';

            return '<div class="card-input-container" style="margin-top:12px; padding-top:12px; border-top:1px dashed var(--line);">' +
              '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">' +
                '<label style="margin:0; font-weight:600;">' + t('cardLabel') + '</label>' +
                '<button type="button" class="btn-line" data-act="fill-demo-card" style="font-size:0.75rem; padding:3px 8px; border-radius:6px; cursor:pointer;">💳 ' + (state.lang === 'ar' ? 'تعبئة بطاقة تجريبية (4242)' : 'Fill Demo Card') + '</button>' +
              '</div>' +
              '<div class="card-input-wrapper">' +
                '<input name="modalCard" class="card-input" data-mask="card" placeholder="' + t('cardPlaceholder') + '" maxlength="19" value="' + esc(state.cardInput || '') + '" required autocomplete="off">' +
                '<span class="card-brand-badge">' + brandObj.icon + '</span>' +
              '</div>' +
              '<div class="card-feedback ' + feedbackClass + '">' + feedbackText + '</div>' +
              '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-top:8px;">' +
                '<label>' + t('expiryLabel') +
                  '<input name="modalExpiry" data-mask="expiry" placeholder="MM/YY" maxlength="5" value="' + esc(state.expiryInput || '') + '" required>' +
                '</label>' +
                '<label>' + t('cvvLabel') +
                  '<input name="modalCvv" data-mask="cvv" placeholder="123" maxlength="4" value="' + esc(state.cvvInput || '') + '" required>' +
                '</label>' +
              '</div>' +
            '</div>';
          })() : '') +
        '</div>' +

        '<!-- Total Calculation Bar -->' +
        '<div class="modal-total-bar">' +
          '<span>' + t('total') + ' الإقامة والخدمات:</span>' +
          '<strong>' + money(grandTotal) + '</strong>' +
        '</div>' +

        '<div class="modal-actions">' +
          '<button class="btn" data-act="confirm-booking">' + (state.modalPayMethod === 'desk' ? t('confirmPayDesk') : t('confirmPayOnline')) + '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  // Main Render
  function render() {
    var user = me();
    var view = state.view;

    if (view === 'stays' && (!user || user.role !== 'guest')) view = 'login';
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
      : viewHome();

    var appEl = document.getElementById('app');
    if (appEl) {
      appEl.innerHTML = shell(inner);
    }

    if (state.chatOpen) {
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

    // Toggle Floating Chat Widget
    var toggleChatBtn = e.target.closest('[data-act="toggle-chat"]');
    if (toggleChatBtn) {
      state.chatOpen = !state.chatOpen;
      if (state.chatOpen) {
        try {
          var cRes = await API.getChatHistory();
          if (cRes && cRes.success) {
            state.chatHistory = cRes.history;
          }
        } catch (err) {
          console.warn('Could not load chat history:', err);
        }
      }
      render();
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
        state.selectedAddons = {};
        state.modalPayMethod = 'online';
        state.cardInput = '';
        state.expiryInput = '';
        state.cvvInput = '';
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

    // Change payment method radio in modal
    var payMethodRadio = e.target.closest('[data-act="change-modal-pay"]');
    if (payMethodRadio) {
      state.modalPayMethod = payMethodRadio.value;
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

    // Fill Demo Test Card
    var fillDemoBtn = e.target.closest('[data-act="fill-demo-card"]');
    if (fillDemoBtn) {
      state.cardInput = '4242 4242 4242 4242';
      state.expiryInput = '12/28';
      state.cvvInput = '123';
      render();
      return;
    }

    // Confirm booking with customized add-ons
    var confirmBookBtn = e.target.closest('[data-act="confirm-booking"]');
    if (confirmBookBtn) {
      var payOnline = state.modalPayMethod !== 'desk';
      var r = state.selectedRoom;

      // Validate credit card if paying online
      if (payOnline) {
        if (!validateLuhn(state.cardInput || '')) {
          showError(state.lang === 'ar' ? 'رقم البطاقة الائتمانية غير صالح! يرجى إدخال 16 رقم صحيح مطابق لمعايير الدفع (Luhn Checksum).' : 'Invalid credit card number! Please check your card digits.');
          return;
        }
      }

      var addOnsList = [];
      if (state.selectedAddons.jacuzzi) addOnsList.push({ name: '🛁 جاكوزي خاص مجهز (Private Jacuzzi)', price: 300 });
      if (state.selectedAddons.sony) addOnsList.push({ name: '🎮 جهاز بلايستيشن 5 (PlayStation 5)', price: 200 });
      if (state.selectedAddons.tour) addOnsList.push({ name: '🏛️ مرشد سياحي خاص (Private Tour Guide)', price: 500 });
      if (state.selectedAddons.airport) addOnsList.push({ name: '🚗 توصيل واستقبال VIP المطار (Airport VIP)', price: 350 });
      if (state.selectedAddons.spa) addOnsList.push({ name: '💆 جلسة سبا ومساج استرخائي (Spa & Massage)', price: 450 });

      try {
        var res = await API.createReservation({
          roomId: r.room_id,
          checkInDate: state.search.checkIn,
          checkOutDate: state.search.checkOut,
          payOnline: payOnline,
          cardInfo: payOnline ? state.cardInput : null,
          mealPlan: null,
          addOns: addOnsList
        });

        state.bookingModalOpen = false;
        state.cardInput = '';
        state.expiryInput = '';
        state.cvvInput = '';
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
        var cRes = await API.getChatHistory();
        if (cRes && cRes.success) {
          state.chatHistory = cRes.history;
          render();
        }
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

    // Toggle Password Visibility
    var togglePwBtn = e.target.closest('[data-act="toggle-password"]');
    if (togglePwBtn) {
      var pwWrapper = togglePwBtn.closest('.password-wrapper');
      if (pwWrapper) {
        var pwInput = pwWrapper.querySelector('input');
        if (pwInput) {
          var isHidden = pwInput.type === 'password';
          pwInput.type = isHidden ? 'text' : 'password';
          togglePwBtn.innerHTML = isHidden ? '🙈' : '👁️';
          togglePwBtn.title = isHidden ? t('hidePassword') : t('showPassword');
          pwInput.focus();
        }
      }
      return;
    }

    // Mark room service delivered
    var delOrderBtn = e.target.closest('[data-act="deliver-order"]');
    if (delOrderBtn) {
      try {
        await API.updateOrderStatus(delOrderBtn.dataset.id, 'Delivered');
        showNotice(state.lang === 'ar' ? 'تم توصيل الطلب بنجاح.' : 'Order marked as delivered.');
        loadViewData();
      } catch (err) {
        showError(err.message);
      }
      return;
    }

    // Cancel individual room service / add-on item
    var cancelItemBtn = e.target.closest('[data-act="cancel-order-item"]');
    if (cancelItemBtn) {
      try {
        var orderId = cancelItemBtn.dataset.id;
        var itemIndex = cancelItemBtn.dataset.index;
        await API.cancelOrderItem(orderId, itemIndex);
        showNotice(state.lang === 'ar' ? 'تم إلغاء الخدمة الإضافية بنجاح.' : 'Add-on service cancelled successfully.');
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
        showNotice(state.lang === 'ar' ? 'تم إلغاء الخدمة بنجاح.' : 'Service cancelled successfully.');
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
      if (!validateLuhn(card)) {
        showError(state.lang === 'ar' ? 'رقم البطاقة الائتمانية غير صالح! يرجى إدخال 16 رقم صحيح مطابق لمعايير الدفع (Luhn Checksum).' : 'Invalid credit card number. Please check the digits.');
        return;
      }
      var stay = state.currentStay;
      try {
        var payRes = await API.processPayment(stay.reservation_id, stay.bill.balance, 'Online', card);
        showNotice(payRes.message);
        state.panel = '';
        state.cardInput = '';
        state.expiryInput = '';
        state.cvvInput = '';
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
          var cost = qty * iPrice;
          selected.push({ name: qty + 'x ' + iName, price: cost });
          total += cost;
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
        await API.sendChatMessage(msg, state.lang);
        var cRes = await API.getChatHistory();
        if (cRes && cRes.success) {
          state.chatHistory = cRes.history;
          render();
        }
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

  // Live Input Masking and Credit Card Validation
  document.addEventListener('input', function (e) {
    var target = e.target;

    // Credit Card Number Formatting (4 digits grouped by space)
    if (target.dataset.mask === 'card' || target.name === 'card' || target.name === 'modalCard') {
      var raw = target.value;
      var formatted = formatCardNumber(raw);
      target.value = formatted;
      state.cardInput = formatted;

      var container = target.closest('.card-input-container') || target.closest('label');
      if (container) {
        var badge = container.querySelector('.card-brand-badge');
        var feedback = container.querySelector('.card-feedback');
        var brandObj = detectCardBrand(formatted);

        if (badge) badge.textContent = brandObj.icon;

        if (feedback) {
          var cleanDigits = formatted.replace(/\D/g, '');
          if (cleanDigits.length >= 13) {
            var isValid = validateLuhn(formatted);
            feedback.className = 'card-feedback ' + (isValid ? 'valid' : 'invalid');
            feedback.textContent = isValid
              ? '✓ ' + (brandObj.name ? brandObj.name + ' - ' : '') + t('cardValid')
              : '✕ ' + t('cardInvalid');
          } else if (cleanDigits.length > 0) {
            feedback.className = 'card-feedback';
            feedback.textContent = brandObj.name ? brandObj.name : '';
          } else {
            feedback.className = 'card-feedback';
            feedback.textContent = '';
          }
        }
      }
    }

    // Expiry Date (MM/YY)
    if (target.dataset.mask === 'expiry') {
      var exp = target.value.replace(/\D/g, '').substring(0, 4);
      if (exp.length >= 2) {
        target.value = exp.substring(0, 2) + '/' + exp.substring(2);
      } else {
        target.value = exp;
      }
      state.expiryInput = target.value;
    }

    // Security Code CVV (3-4 digits max)
    if (target.dataset.mask === 'cvv') {
      target.value = target.value.replace(/\D/g, '').substring(0, 4);
      state.cvvInput = target.value;
    }
  });

  // Init Language on document
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';

  // Initial Boot
  go('home');
})();
