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

  // 2. Query DB: Room types and prices
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
            response: `أسعار وأنواع الغرف المتاحة من قاعدة البيانات: ${details}. جميع الحجوزات تشمل واي فاي مجاني عالي السرعة ووجبة إفطار مجانية.`
          };
        } else {
          const details = rows.map(r => `${r.type}: EGP ${Number(r.min_price).toFixed(2)}${r.min_price !== r.max_price ? ' - ' + Number(r.max_price).toFixed(2) : ''} per night`).join(' | ');
          return {
            canAnswer: true,
            escalated: false,
            response: `Our room rates and types from the database: ${details}. All bookings include free high-speed Wi-Fi and complimentary breakfast.`
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

  // 4. Query DB: Guest's own reservation and balance
  if (
    guestId && (
      text.includes('my booking') || text.includes('my reservation') || text.includes('my stay') || 
      text.includes('balance') || text.includes('bill') || text.includes('due') ||
      text.includes('حجزي') || text.includes('حجوزاتي') || text.includes('الحساب') || text.includes('الفاتورة')
    )
  ) {
    try {
      const [resRows] = await pool.query(
        `SELECT r.reservation_id, rm.room_number, rm.type, 
                DATE_FORMAT(r.check_in_date, '%Y-%m-%d') AS check_in_date,
                DATE_FORMAT(r.check_out_date, '%Y-%m-%d') AS check_out_date,
                r.status, r.total_price,
                COALESCE((SELECT SUM(o.total_price) FROM room_service_order o WHERE o.reservation_id = r.reservation_id AND o.status <> 'Cancelled'), 0) AS service_total,
                COALESCE((SELECT SUM(p.amount) FROM payment p WHERE p.reservation_id = r.reservation_id AND p.status = 'Paid'), 0) AS amount_paid
         FROM reservation r
         JOIN room rm ON rm.room_id = r.room_id
         WHERE r.guest_id = ?
         ORDER BY r.created_at DESC
         LIMIT 1`,
        [guestId]
      );

      if (resRows.length > 0) {
        const stay = resRows[0];
        const grandTotal = Number((Number(stay.total_price) + Number(stay.service_total)).toFixed(2));
        const balance = Number((grandTotal - Number(stay.amount_paid)).toFixed(2));
        const statusNames = { Pending: 'قيد الانتظار', Confirmed: 'مؤكد', 'Checked-In': 'مقيم حالياً', 'Checked-Out': 'غادر', Completed: 'مكتمل', Cancelled: 'ملغي' };
        if (isAr) {
          return {
            canAnswer: true,
            escalated: false,
            response: `آخر حجز لك هو رقم #${stay.reservation_id} لغرفة ${stay.room_number} (${stay.type}). التواريخ: ${stay.check_in_date} إلى ${stay.check_out_date}. الحالة: [${statusNames[stay.status] || stay.status}]. الإجمالي: ${grandTotal} ج.م، المتبقي للدفع: ${balance > 0 ? balance : 0} ج.م.`
          };
        } else {
          return {
            canAnswer: true,
            escalated: false,
            response: `Your latest booking is #${stay.reservation_id} for Room ${stay.room_number} (${stay.type}). Dates: ${stay.check_in_date} to ${stay.check_out_date}. Status: [${stay.status}]. Total: EGP ${grandTotal}, Balance due: EGP ${balance > 0 ? balance : 0}.`
          };
        }
      } else {
        return {
          canAnswer: true,
          escalated: false,
          response: isAr
            ? 'لا توجد حجوزات مسجلة على حسابك حتى الآن. يمكنك اختيار غرفة وإجراء حجز في أي وقت!'
            : 'You do not have any bookings registered under your account yet. You can choose a room and make a reservation anytime!'
        };
      }
    } catch (e) {
      console.warn('DB query error in chatbot:', e.message);
    }
  }

  // 5. General Hotel FAQs (Check-in, Check-out, Amenities, Room Service)
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
