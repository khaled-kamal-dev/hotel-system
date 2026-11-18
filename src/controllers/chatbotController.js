const { pool } = require('../config/db');

// Helper: Analyze question and query database (Sequence 2 steps 2-5)
// lang parameter: 'ar' for Arabic responses, 'en' for English responses
async function analyzeQuestionAndAnswer(message, guestId, lang) {
  const text = message.toLowerCase().trim();
  const isAr = lang === 'ar';

  // 1. Check if guest explicitly requests a receptionist / human staff
  const humanKeywords = [
    'receptionist', 'reception', 'desk', 'human', 'agent', 'person', 'staff', 
    'complaint', 'problem', 'issue', 'talk to receptionist', 'help me',
    'موظف', 'استقبال', 'موظفة', 'مشكلة', 'شكوى', 'بشري', 'انسان', 'مساعدة شخصية'
  ];
  const asksForHuman = humanKeywords.some(kw => text.includes(kw));

  if (asksForHuman) {
    return {
      canAnswer: false,
      escalated: true,
      response: isAr
        ? 'تم تحويل استفسارك مباشرة إلى موظف الاستقبال. سيقوم أحد أعضاء الفريق بالرد عليك في أقرب وقت.'
        : 'I am transferring your request directly to our front desk receptionist. A team member will reply to you shortly.'
    };
  }

  // 2. Add-ons, Amenities & Extra Services
  if (
    text.includes('اضافات') || text.includes('إضافات') || text.includes('خدمات') || text.includes('سبا') || 
    text.includes('مساج') || text.includes('جاكوزي') || text.includes('بلايستيشن') || text.includes('مطار') || 
    text.includes('مرشد') || text.includes('وجبات') || text.includes('طعام') || text.includes('اكل') ||
    text.includes('spa') || text.includes('massage') || text.includes('jacuzzi') || text.includes('playstation') || 
    text.includes('airport') || text.includes('addons') || text.includes('amenities') || text.includes('meal')
  ) {
    if (isAr) {
      return {
        canAnswer: true,
        escalated: false,
        response: 
`✨ قائمة الخدمات والإضافات المتوفرة في فندق نايل هاوس:
🍽️ إقامة كاملة (All-Inclusive): جميع الوجبات اليومية (إفطار، غداء، عشاء بوفيه مفتوح) مشمولة مجاناً في سعر الحجز!
🚗 توصيل واستقبال VIP المطار: +350 ج.م
💆 جلسة سبا ومساج استرخائي كامل للجسم: +450 ج.م
🛁 تجهيز جاكوزي خاص فاخر داخل الغرفة: +300 ج.م
🎮 جهاز بلايستيشن 5 مع ألعاب في الغرفة: +200 ج.م
🏛️ مرشد سياحي مرخص لجولة معالم القاهرة والأهرامات: +500 ج.م
كما تتوفر خدمة غرف 24 ساعة للمأكولات والمشروبات الخفيفة من صفحة الحجز.`
      };
    } else {
      return {
        canAnswer: true,
        escalated: false,
        response: 
`✨ Available Extra Services & Amenities at Nile House:
🍽️ Full Board All-Inclusive: Complimentary daily breakfast, lunch, and dinner buffet included in your room rate!
🚗 VIP Airport Pickup & Drop-off: +EGP 350
💆 Full Body Relaxation Spa & Massage: +EGP 450
🛁 Private In-Room Jacuzzi Setup: +EGP 300
🎮 Sony PlayStation 5 in-room console: +EGP 200
🏛️ Licensed Tour Guide for Cairo & Pyramids Excursions: +EGP 500
24/7 Room Service menu is also available anytime from your booking page.`
      };
    }
  }

  // 3. Query DB: Room types and prices
  if (
    text.includes('price') || text.includes('cost') || text.includes('rate') || 
    text.includes('room type') || text.includes('rooms') || text.includes('suite') || 
    text.includes('single') || text.includes('double') ||
    text.includes('سعر') || text.includes('اسعار') || text.includes('غرفة') || 
    text.includes('غرف') || text.includes('انواع') || text.includes('سويت')
  ) {
    try {
      const [rows] = await pool.query(
        `SELECT type, MIN(price_per_night) AS min_price, MAX(price_per_night) AS max_price, COUNT(*) AS total_rooms 
         FROM room 
         GROUP BY type 
         ORDER BY min_price ASC`
      );

      if (rows.length > 0) {
        if (isAr) {
          const typeNames = { Single: 'فردية', Double: 'مزدوجة', Suite: 'سويت فاخر' };
          const details = rows.map(r => `${typeNames[r.type] || r.type}: ${Number(r.min_price).toFixed(0)}${r.min_price !== r.max_price ? ' - ' + Number(r.max_price).toFixed(0) : ''} ج.م / ليلة`).join(' | ');
          return {
            canAnswer: true,
            escalated: false,
            response: `أسعار وأنواع الغرف المتاحة من قاعدة البيانات: ${details}. جميع الحجوزات تشمل إقامة كاملة بجميع الوجبات مجاناً (إفطار، غداء، وعشاء) وواي فاي فائق السرعة.`
          };
        } else {
          const details = rows.map(r => `${r.type}: EGP ${Number(r.min_price).toFixed(2)}${r.min_price !== r.max_price ? ' - ' + Number(r.max_price).toFixed(2) : ''} per night`).join(' | ');
          return {
            canAnswer: true,
            escalated: false,
            response: `Our room rates and types from the database: ${details}. All bookings include complimentary full board meals (breakfast, lunch & dinner) and free high-speed Wi-Fi.`
          };
        }
      }
    } catch (e) {
      console.warn('DB query error in chatbot:', e.message);
    }
  }

  // 3. Query DB: Room availability right now
  if (
    text.includes('available') || text.includes('availability') || text.includes('free room') || 
    text.includes('vacant') || text.includes('متاح') || text.includes('فاضي') || text.includes('شاغر')
  ) {
    try {
      const [availableRows] = await pool.query(
        `SELECT type, COUNT(*) AS count 
         FROM room 
         WHERE status = 'Available' 
         GROUP BY type`
      );

      if (availableRows.length > 0) {
        if (isAr) {
          const typeNames = { Single: 'فردية', Double: 'مزدوجة', Suite: 'سويت' };
          const counts = availableRows.map(r => `${r.count} غرفة ${typeNames[r.type] || r.type}`).join('، ');
          return {
            canAnswer: true,
            escalated: false,
            response: `الغرف المتاحة حالياً: ${counts}. يمكنك البحث بتواريخ إقامتك من الصفحة الرئيسية لحجز غرفتك.`
          };
        } else {
          const counts = availableRows.map(r => `${r.count} ${r.type}(s)`).join(', ');
          return {
            canAnswer: true,
            escalated: false,
            response: `Currently, we have available right now: ${counts}. You can search your exact check-in dates on our home page to reserve.`
          };
        }
      } else {
        return {
          canAnswer: true,
          escalated: false,
          response: isAr
            ? 'جميع الغرف مشغولة أو قيد الصيانة حالياً، لكن يمكنك حجز غرفة لتواريخ مستقبلية من خلال نموذج البحث!'
            : 'All rooms are occupied or being serviced for tonight, but rooms may still be reserved for future dates using the search form!'
        };
      }
    } catch (e) {
      console.warn('DB query error in chatbot:', e.message);
    }
  }

  // 4. Query DB: Guest's own reservation, billing, invoice and balance
  const bookingKeywords = [
    'my booking', 'my reservation', 'my stay', 'balance', 'bill', 'due', 'invoice', 
    'receipt', 'payment', 'paid', 'charges', 'statement', 'cost of stay', 'booking details',
    'حجز', 'حجزي', 'حجوزاتي', 'الحجز', 'حجوزات', 'تفاصيل', 'فاتورة', 'فواتير', 'فواتيري', 
    'الفاتورة', 'الفواتير', 'حساب', 'حسابي', 'الحساب', 'كشف حساب', 'فلوس', 'فلوسي', 
    'دفع', 'دفعت', 'مدفوع', 'متبقي', 'باقي', 'المتبقي', 'الباقي', 'تكلفة', 'التكلفة', 
    'مصاريف', 'المصاريف', 'اجمالي', 'الإجمالي', 'وصل', 'ايصال', 'إيصال', 'اخير', 'الأخير', 
    'بتاعي', 'عليا كام', 'ادفع كام', 'استعلام'
  ];
  const isBookingQuery = bookingKeywords.some(kw => text.includes(kw));

  if (isBookingQuery) {
    if (!guestId) {
      return {
        canAnswer: true,
        escalated: false,
        response: isAr
          ? 'يرجى تسجيل الدخول إلى حسابك أولاً لعرض تفاصيل حجزك وفاتورتك الشخصية.'
          : 'Please sign in to your account first to view your booking and invoice details.'
      };
    }

    try {
      const [resRows] = await pool.query(
        `SELECT r.reservation_id, rm.room_number, rm.type AS room_type, rm.price_per_night,
                DATEDIFF(r.check_out_date, r.check_in_date) AS nights,
                DATE_FORMAT(r.check_in_date, '%Y-%m-%d') AS check_in_date,
                DATE_FORMAT(r.check_out_date, '%Y-%m-%d') AS check_out_date,
                r.status, r.total_price AS room_total
         FROM reservation r
         JOIN room rm ON rm.room_id = r.room_id
         WHERE r.guest_id = ?
         ORDER BY r.created_at DESC
         LIMIT 1`,
        [guestId]
      );

      if (resRows.length > 0) {
        const stay = resRows[0];
        const roomTotal = Number(stay.room_total) || 0;
        const nights = stay.nights || 1;

        // Fetch room service orders & add-ons for this reservation
        const [orders] = await pool.query(
          `SELECT order_id, items, total_price, status 
           FROM room_service_order 
           WHERE reservation_id = ? 
           ORDER BY order_id ASC`,
          [stay.reservation_id]
        );

        // Fetch payments made for this reservation
        const [payments] = await pool.query(
          `SELECT payment_id, amount, method, status, DATE_FORMAT(paid_at, '%Y-%m-%d %H:%i') AS paid_at, gateway_ref 
           FROM payment 
           WHERE reservation_id = ? 
           ORDER BY payment_id ASC`,
          [stay.reservation_id]
        );

        const activeOrders = orders.filter(o => o.status !== 'Cancelled');
        const cancelledOrders = orders.filter(o => o.status === 'Cancelled');
        const serviceTotal = activeOrders.reduce((sum, o) => sum + Number(o.total_price), 0);
        const grandTotal = Number((roomTotal + serviceTotal).toFixed(2));
        const amountPaid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + Number(p.amount), 0);
        const balanceDue = Math.max(0, Number((grandTotal - amountPaid).toFixed(2)));

        const statusNamesAr = {
          Pending: 'قيد الانتظار',
          Confirmed: 'مؤكد',
          'Checked-In': 'مقيم حالياً بالفندق',
          'Checked-Out': 'تم تسجيل المغادرة',
          Completed: 'مكتمل',
          Cancelled: 'ملغي'
        };

        const roomTypeNamesAr = {
          Single: 'فردية (Single)',
          Double: 'مزدوجة (Double)',
          Suite: 'جناح فاخر (Suite)'
        };

        if (isAr) {
          let ordersBreakdown = '';
          if (activeOrders.length > 0) {
            ordersBreakdown = '\n• 🛎️ الإضافات وخدمات الغرف النشطة:\n' + 
              activeOrders.map(o => `   - ${o.items}: ${Number(o.total_price).toFixed(2)} ج.م [${o.status === 'Delivered' ? 'تم التوصيل' : 'قيد التجهيز'}]`).join('\n');
          } else {
            ordersBreakdown = '\n• 🛎️ الإضافات وخدمات الغرف: لا توجد إضافات نشطة (0.00 ج.م)';
          }

          if (cancelledOrders.length > 0) {
            ordersBreakdown += '\n• ❌ الإضافات الملغاة (تم خصمها من الحساب):\n' + 
              cancelledOrders.map(o => `   - ${o.items}: ${Number(o.total_price).toFixed(2)} ج.م [ملغي]`).join('\n');
          }

          let paymentsInfo = '';
          if (payments.length > 0) {
            paymentsInfo = '\n• 💳 سجل المدفوعات:\n' + 
              payments.map(p => `   - ${p.method === 'Online' ? 'دفع إلكتروني بالبطاقة' : p.method}: ${Number(p.amount).toFixed(2)} ج.م [${p.status === 'Paid' ? 'تم السداد بنجاح' : p.status}]`).join('\n');
          } else {
            paymentsInfo = '\n• 💳 سجل المدفوعات: لم يتم تسجيل مدفوعات إلكترونية بعد (الدفع عند مكتب الاستقبال)';
          }

          const responseText = 
`🧾 تفاصيل فاتورة وحساب حجزك رقم #${stay.reservation_id}:
🏨 الغرفة: رقم ${stay.room_number} (${roomTypeNamesAr[stay.room_type] || stay.room_type})
📅 مدة الإقامة: من ${stay.check_in_date} إلى ${stay.check_out_date} (${nights} ${nights > 1 ? 'ليالٍ' : 'ليلة'})
📌 حالة الحجز: [${statusNamesAr[stay.status] || stay.status}]

💰 بيان التكلفة والحساب التفصيلي:
• 🛏️ تكلفة الإقامة بالغرفة: ${roomTotal.toFixed(2)} ج.م (${stay.price_per_night} ج.م × ${nights} ليلة)${ordersBreakdown}${paymentsInfo}
─────────────────────
💵 إجمالي الفاتورة الكلي: ${grandTotal.toFixed(2)} ج.م
💳 إجمالي المسدد / المدفوع: ${amountPaid.toFixed(2)} ج.م
⚖️ المبلغ المتبقي للسداد: ${balanceDue.toFixed(2)} ج.م ${balanceDue === 0 ? '✓ (الحساب مسدد بالكامل)' : '(مستحق الدفع عند مكتب الاستقبال)'}`;

          return {
            canAnswer: true,
            escalated: false,
            response: responseText
          };
        } else {
          let ordersBreakdown = '';
          if (activeOrders.length > 0) {
            ordersBreakdown = '\n• 🛎️ Active Room Service & Add-ons:\n' + 
              activeOrders.map(o => `   - ${o.items}: EGP ${Number(o.total_price).toFixed(2)} [${o.status}]`).join('\n');
          } else {
            ordersBreakdown = '\n• 🛎️ Room Service & Add-ons: None (EGP 0.00)';
          }

          if (cancelledOrders.length > 0) {
            ordersBreakdown += '\n• ❌ Cancelled Items (Deducted from Bill):\n' + 
              cancelledOrders.map(o => `   - ${o.items} [Cancelled]`).join('\n');
          }

          let paymentsInfo = '';
          if (payments.length > 0) {
            paymentsInfo = '\n• 💳 Payments Made:\n' + 
              payments.map(p => `   - ${p.method}: EGP ${Number(p.amount).toFixed(2)} [${p.status}]`).join('\n');
          }

          const responseText = 
`🧾 Detailed Invoice & Statement for Booking #${stay.reservation_id}:
🏨 Room: #${stay.room_number} (${stay.room_type})
📅 Dates: ${stay.check_in_date} to ${stay.check_out_date} (${nights} night(s))
📌 Status: [${stay.status}]

💰 Financial Breakdown:
• 🛏️ Room Accommodation: EGP ${roomTotal.toFixed(2)} (EGP ${stay.price_per_night} × ${nights} night(s))${ordersBreakdown}${paymentsInfo}
─────────────────────
💵 Grand Total: EGP ${grandTotal.toFixed(2)}
💳 Total Paid: EGP ${amountPaid.toFixed(2)}
⚖️ Balance Due: EGP ${balanceDue.toFixed(2)} ${balanceDue === 0 ? '✓ (Fully Settled)' : '(Payable at Reception/Checkout)'}`;

          return {
            canAnswer: true,
            escalated: false,
            response: responseText
          };
        }
      } else {
        return {
          canAnswer: true,
          escalated: false,
          response: isAr
            ? 'لا توجد حجوزات مسجلة على حسابك حتى الآن. يمكنك اختيار غرفة وإجراء حجز في أي وقت من الصفحة الرئيسية!'
            : 'You do not have any bookings registered under your account yet. You can choose a room and make a reservation anytime on the home page!'
        };
      }
    } catch (e) {
      console.warn('DB query error in chatbot:', e.message);
    }
  }

  // 6. General Hotel FAQs (Check-in, Check-out, Amenities, Room Service)
  if (text.includes('check-in time') || text.includes('check-out time') || text.includes('time') || text.includes('ميعاد') || text.includes('وقت')) {
    return {
      canAnswer: true,
      escalated: false,
      response: isAr
        ? 'موعد تسجيل الوصول (Check-in) الساعة 2:00 ظهراً، وموعد المغادرة (Check-out) الساعة 12:00 ظهراً. يمكن طلب تسجيل وصول مبكر أو مغادرة متأخرة من خلال موظف الاستقبال.'
        : 'Standard Check-in time is at 2:00 PM, and Check-out is at 12:00 PM. Early check-in or late check-out can be requested through our front desk receptionist.'
    };
  }

  if (text.includes('service') || text.includes('food') || text.includes('breakfast') || text.includes('order') || text.includes('طعام') || text.includes('اكل') || text.includes('خدمة الغرف')) {
    return {
      canAnswer: true,
      escalated: false,
      response: isAr
        ? 'خدمة الغرف متاحة على مدار 24 ساعة للنزلاء المقيمين! تشمل الأصناف: شاي بالنعناع الطازج، عصائر طبيعية، ساندويتشات كلوب، وأطباق مشويات.'
        : 'Room service is available 24 hours a day for checked-in guests! Items include fresh mint tea, fresh juices, club sandwiches, and grill platters.'
    };
  }

  if (text.includes('wifi') || text.includes('internet') || text.includes('واي فاي') || text.includes('نت')) {
    return {
      canAnswer: true,
      escalated: false,
      response: isAr
        ? 'واي فاي فائق السرعة متاح مجاناً في جميع أنحاء فندق نايل هاوس. يتم تزويدك بكلمة المرور عند تسجيل الوصول.'
        : 'High-speed fiber Wi-Fi is available complimentary throughout Nile House. The network password is provided upon check-in.'
    };
  }

  // 6. Unknown query -> Sequence 2 alt [cannot answer, or guest asks for receptionist]
  // Transfer to receptionist
  return {
    canAnswer: false,
    escalated: true,
    response: isAr
      ? 'لم أتمكن من إيجاد إجابة آلية لاستفسارك في قاعدة البيانات. تم تحويل المحادثة إلى موظف الاستقبال وسيرد عليك مباشرة.'
      : 'I could not find an exact automated match for your inquiry in the database. I have transferred this conversation to our front desk receptionist who will reply directly.'
  };
}

// Sequence 2: sendMessage(question)
async function sendInquiry(req, res) {
  const { message, lang } = req.body;
  const guestId = req.user ? req.user.userId : null;
  const chatLang = lang || 'en';

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Message cannot be empty.' });
  }

  if (!guestId) {
    return res.status(401).json({ success: false, message: 'Please sign in to chat with the assistant.' });
  }

  try {
    // Sequence 2: step 2 analyzeQuestion(), step 3-4 getInfo()
    const result = await analyzeQuestionAndAnswer(message.trim(), guestId, chatLang);

    // Insert into `chatbot` table (matches ERD schema)
    const [insertResult] = await pool.query(
      `INSERT INTO chatbot (guest_id, receptionist_id, message, response, escalated, created_at)
       VALUES (?, NULL, ?, ?, ?, NOW())`,
      [guestId, message.trim(), result.response, result.escalated ? 1 : 0]
    );

    const chatId = insertResult.insertId;

    res.status(201).json({
      success: true,
      chat: {
        chatId,
        guestId,
        message: message.trim(),
        response: result.response,
        escalated: result.escalated,
        createdAt: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('sendInquiry error:', err);
    res.status(500).json({ success: false, message: 'Server error processing chat inquiry.' });
  }
}

// Get guest's chat inquiry history
async function getGuestHistory(req, res) {
  const guestId = req.user.userId;
  try {
    const [rows] = await pool.query(
      `SELECT 
        c.chat_id,
        c.guest_id,
        c.receptionist_id,
        c.message,
        c.response,
        c.escalated,
        c.created_at,
        u.name AS receptionist_name,
        rec.shift AS receptionist_shift
       FROM chatbot c
       LEFT JOIN receptionist rec ON rec.user_id = c.receptionist_id
       LEFT JOIN \`user\` u ON u.user_id = rec.user_id
       WHERE c.guest_id = ?
       ORDER BY c.created_at ASC`,
      [guestId]
    );

    res.json({ success: true, count: rows.length, history: rows });
  } catch (err) {
    console.error('getGuestHistory error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving chat history.' });
  }
}

// Sequence 2 steps 7 & 8: View escalated chats for Receptionist
async function getEscalatedChats(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT 
        c.chat_id,
        c.guest_id,
        c.receptionist_id,
        c.message,
        c.response,
        c.escalated,
        c.created_at,
        u_guest.name AS guest_name,
        u_guest.email AS guest_email,
        g.phone AS guest_phone,
        u_rec.name AS receptionist_name
       FROM chatbot c
       JOIN \`user\` u_guest ON u_guest.user_id = c.guest_id
       JOIN guest g ON g.user_id = c.guest_id
       LEFT JOIN \`user\` u_rec ON u_rec.user_id = c.receptionist_id
       WHERE c.escalated = 1
       ORDER BY c.created_at DESC`
    );

    res.json({ success: true, count: rows.length, chats: rows });
  } catch (err) {
    console.error('getEscalatedChats error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving escalated chats.' });
  }
}

// Sequence 2 steps 9-11: Receptionist accepts and replies to an escalated chat
async function replyToChat(req, res) {
  const { id } = req.params;
  const { replyMessage } = req.body;
  const receptionistId = req.user.userId;

  if (!replyMessage || !replyMessage.trim()) {
    return res.status(400).json({ success: false, message: 'Reply message cannot be empty.' });
  }

  try {
    const [chatRows] = await pool.query('SELECT * FROM chatbot WHERE chat_id = ?', [id]);
    if (chatRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Chat inquiry not found.' });
    }

    const currentChat = chatRows[0];
    const updatedResponse = `[Front Desk - Receptionist]: ${replyMessage.trim()}`;

    // Step 10: setEscalated(receptionistId) and Step 11: reply(message)
    await pool.query(
      'UPDATE chatbot SET receptionist_id = ?, response = ?, escalated = 1 WHERE chat_id = ?',
      [receptionistId, updatedResponse, id]
    );

    res.json({
      success: true,
      message: 'Reply sent successfully.',
      chatId: Number(id),
      receptionistId,
      response: updatedResponse
    });
  } catch (err) {
    console.error('replyToChat error:', err);
    res.status(500).json({ success: false, message: 'Server error sending receptionist reply.' });
  }
}

// Force escalation endpoint (Sequence 2 step 7: Guest clicks "Ask for the desk")
async function escalateLatest(req, res) {
  const guestId = req.user.userId;
  try {
    const [latest] = await pool.query(
      'SELECT chat_id FROM chatbot WHERE guest_id = ? ORDER BY chat_id DESC LIMIT 1',
      [guestId]
    );

    if (latest.length === 0) {
      return res.status(404).json({ success: false, message: 'No chat to escalate.' });
    }

    const chatId = latest[0].chat_id;
    await pool.query(
      "UPDATE chatbot SET escalated = 1, response = 'Transferring you to a receptionist right now. Please hold on.' WHERE chat_id = ?",
      [chatId]
    );

    res.json({
      success: true,
      message: 'Chat has been escalated to the receptionist.',
      chatId
    });
  } catch (err) {
    console.error('escalateLatest error:', err);
    res.status(500).json({ success: false, message: 'Server error escalating chat.' });
  }
}

module.exports = {
  sendInquiry,
  getGuestHistory,
  getEscalatedChats,
  replyToChat,
  escalateLatest
};
