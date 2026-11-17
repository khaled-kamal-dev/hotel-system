# 🏨 Nile House - Hotel Management System
### Full-Stack Hotel System with Node.js, Express, MySQL & AI Chatbot

نظام متكامل لإدارة الفنادق مبني طبقاً لمخططات **ERD**, **Class Diagram**, **Use Case Diagram**, و **Sequence Diagrams (1 to 5)**.

---

## 🌟 المميزات والمكونات الرئيسية (Features)

1. **قاعدة بيانات MySQL مطابقة للـ ERD 100%**:
   - جدول `chatbot` مطابق تماماً للـ ERD مع الربط بالضيف وموظف الاستقبال وحالة التصعيد `escalated`.
   - **توحيد حالة الحجز (Checked-Out / COMPLETED)** لدعم مخططات الـ Sequence Diagram 4 والـ ERD بدون أي تعارض في القيود (`CHECK Constraint`).
   - تتبع حالات الغرف (`Available`, `Occupied`, `Dirty`) وجدول سجل التحديثات `room_status_update`.
   - منع الحجوزات المتداخلة لنفس الغرفة عبر MySQL Triggers.
   - حساب الفواتير والمدفوعات والمتبقي عبر View `v_reservation_bill`.

2. **Backend بـ Node.js + Express**:
   - نظام مصادقة كامل بـ **JWT (JSON Web Tokens)** وتشفير كلمات المرور بـ **Bcrypt**.
   - تسجيل حسابات الضيوف (`Register`) وتسجيل الدخول للضيوف وموظفي الاستقبال (`Login`).
   - تنفيذ كامل لـ **Sequence Diagrams**:
     - **Sequence 1**: إنشاء الحجز والدفع الإلكتروني المباشر وحساب إجمالي السعر.
     - **Sequence 2**: شات بوت ذكي يستعلم مباشرة من الـ Database عن أسعار وأنواع الغرف والغرف المتاحة وحجوزات الضيف، مع إمكانية التحويل التلقائي أو اليدوي لموظف الاستقبال ليرد بدوره.
     - **Sequence 3**: تسكين الضيف (`Check-In`) وتحديث حالة الغرفة إلى `Occupied` وتسجيل العملية في الـ Audit Log.
     - **Sequence 4**: مغادرة الضيف (`Check-Out`) وحساب المتبقي والدفع وتغيير حالة الحجز إلى `Completed` والغرفة إلى `Dirty` واستخراج الفاتورة.
     - **Sequence 5**: إدارة الحجز من قبل الضيف: تعديل المواعيد (`Modify Booking`) أو الإلغاء مع استرداد المبلغ (`Cancel Booking & Refund`).
     - خدمة الغرف (`Room Service Orders`) وإضافتها لحساب الفاتورة.
     - نظام التقييمات (`Reviews`) بالنجوم والتعليقات بعد انتهاء الإقامة.

3. **Frontend تفاعلي بـ HTML / CSS / JavaScript**:
   - تصميم عصري وفاخر ومتجاوب بالكامل.
   - شاشات خاصة بالضيف: البحث عن الغرف بالتواريخ، الحجز، متابعة الإقامات، طلب خدمة الغرف، التقييم، والشات التفاعلي.
   - شاشات خاصة بموظف الاستقبال: لوحة الـ Front Desk (القادمون اليوم للـ Check-in، المقيمون للـ Check-out، الحجوزات القادمة)، لوحة إدارة الغرف وسجل التعديلات، وشاشة الرد على استفسارات الضيوف المحولة من البوت.

---

## 🚀 متطلبات التشغيل (Prerequisites)

- **Node.js** (إصدار 16 أو أحدث)
- خادم **MySQL** (مثل MySQL Server أو XAMPP / WampServer / Laragon)

---

## 🛠️ خطوات التشغيل خطوة بخطوة (Step-by-Step Setup)

### 1) إعداد قاعدة البيانات في MySQL
1. افتح أداة إدارة MySQL لديك (مثل **phpMyAdmin** أو **MySQL Workbench** أو سطر الأوامر).
2. قم باستيراد ملف قاعدة البيانات:
   ```
   database/hotel_system.sql
   ```
   (الملف يقوم بإنشاء قاعدة البيانات `hotel_system` والجداول العشرة، والـ Views، والـ Triggers، مع بيانات تجريبية جاهزة).

### 2) ضبط ملف البيئة `.env`
- افتح ملف `.env` في مجلد المشروع وتأكد من بيانات الاتصال بـ MySQL:
  ```env
  PORT=3000
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=
  DB_NAME=hotel_system
  DB_PORT=3306
  JWT_SECRET=hotel_jwt_secret_key_super_secure_2026
  ```
  *(إذا كان لـ MySQL كلمة مرور مثل `root`، قم بكتابتها في `DB_PASSWORD`)*.

### 3) تثبيت المكتبات (Dependencies)
افتح موجه الأوامر (Terminal / CMD / PowerShell) داخل مجلد المشروع، ثم نفذ:
```bash
npm install
```

### 4) تشغيل الخادم (Start Server)
لتشغيل الخادم، نفذ:
```bash
npm start
```
أو في وضع التطوير والتحديث التلقائي:
```bash
npm run dev
```

### 5) فتح الموقع في المتصفح
افتح المتصفح وتوجه إلى:
```
http://localhost:3000
```

---

## 👥 حسابات تجريبية جاهزة للاختبار (Demo Accounts)

يمكنك الضغط على الأزرار المتاحة في صفحة تسجيل الدخول لملء البيانات تلقائياً، أو استخدام البيانات الآتية:

| الدور (Role) | البريد الإلكتروني (Email) | كلمة المرور (Password) | التفاصيل |
|---|---|---|---|
| **Guest (ضيف)** | `omar@example.com` | `demo123` | لديه حجز مكتمل سابق وحجز قيد الانتظار |
| **Guest (ضيف)** | `sara@example.com` | `demo123` | حجز مؤكد ومدفوع بالكامل |
| **Guest (ضيف)** | `mona@example.com` | `demo123` | مقيمة حالياً في الفندق (Checked-In) |
| **Receptionist (استقبال)** | `ahmed@hotel.com` | `staff123` | موظف استقبال (Shift: Morning) |

*(يمكن أيضاً تسجيل حساب ضيف جديد في ثوانٍ من زر `Register` مع إدخال رقم الهاتف).*

---

## 📊 هيكل الجداول في قاعدة البيانات (Database Schema)

| # | اسم الجدول | الوصف والربط |
|---|---|---|
| 1 | `user` | الجدول الأساسي للمستخدمين (الاسم، الإيميل، كلمة المرور المشفرة) |
| 2 | `guest` | يرث من `user` ويحمل رقم هاتف الضيف (`phone`) |
| 3 | `receptionist` | يرث من `user` ويحمل رقم وظيفي (`employee_id`) والوردية (`shift`) |
| 4 | `room` | الغرف، رقم الغرفة، النوع (Single/Double/Suite)، السعر، والحالة الفيزيائية |
| 5 | `reservation` | الحجوزات مع توحيد الحالة (`Pending`, `Confirmed`, `Checked-In`, `Completed`, `Checked-Out`, `Cancelled`) |
| 6 | `review` | تقييمات الضيوف للإقامات المنتهية (من 1 إلى 5 مع تعليق) |
| 7 | `payment` | المدفوعات (Online, Credit Card, Cash) وحالاتها (Pending, Paid, Refunded) |
| 8 | `room_service_order` | طلبات خدمة الغرف التابعة للحجز وإجمالي قيمتها |
| 9 | `room_status_update` | سجل التغييرات على حالة الغرف بالموظف والوقت |
| 10 | `chatbot` | سجل محادثات البوت والردود، مع حقل `escalated` وموظف الاستقبال المتولّي للرد |

---

## 📡 أهم مسارات الـ API (REST API Endpoints)

- **Auth**:
  - `POST /api/auth/register` - تسجيل ضيف جديد.
  - `POST /api/auth/login` - تسجيل الدخول وإرجاع الـ JWT.
  - `GET /api/auth/me` - جلب بيانات المستخدم المسجل.

- **Rooms**:
  - `GET /api/rooms` - عرض الغرف أو البحث بالتواريخ (مع فلترة الحجوزات المتقاطعة).
  - `PUT /api/rooms/:id/status` - تعديل حالة الغرفة (للاستقبال فقط).
  - `GET /api/rooms/status-log` - سجل تغيير حالات الغرف.

- **Reservations**:
  - `POST /api/reservations` - إنشاء حجز جديد (Sequence 1).
  - `GET /api/reservations/my` - حجوزات الضيف المسجل.
  - `GET /api/reservations/:id` - تفاصيل الحجز والفاتورة.
  - `PUT /api/reservations/:id/cancel` - إلغاء الحجز والاسترداد (Sequence 5).
  - `PUT /api/reservations/:id/modify` - تعديل مواعيد الحجز (Sequence 5).
  - `POST /api/reservations/:id/check-in` - تسكين الضيف (Sequence 3).
  - `POST /api/reservations/:id/check-out` - مغادرة الضيف والدفع (Sequence 4).
  - `GET /api/reservations/desk/board` - لوحة الاستقبال (Arrivals, In-House, Upcoming).

- **Chatbot (Sequence 2)**:
  - `POST /api/chatbot/message` - إرسال سؤال للبوت (يجيب من الـ DB أو يصعد للاستقبال).
  - `GET /api/chatbot/history` - محادثات الضيف وردود البوت وموظف الاستقبال.
  - `GET /api/chatbot/escalated` - قائمة الرسائل المصعدة لموظف الاستقبال.
  - `POST /api/chatbot/:id/reply` - رد موظف الاستقبال على الضيف.

---

## 📁 هيكل مجلدات المشروع

```
hotel-system/
├── package.json
├── .env.example
├── .env
├── server.js
├── README.md
├── database/
│   └── hotel_system.sql
├── src/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── roomController.js
│   │   ├── reservationController.js
│   │   ├── paymentController.js
│   │   ├── roomServiceController.js
│   │   ├── reviewController.js
│   │   └── chatbotController.js
│   └── routes/
│       ├── authRoutes.js
│       ├── roomRoutes.js
│       ├── reservationRoutes.js
│       ├── paymentRoutes.js
│       ├── roomServiceRoutes.js
│       ├── reviewRoutes.js
│       └── chatbotRoutes.js
└── public/
    ├── index.html
    ├── css/
    │   └── styles.css
    └── js/
        ├── api.js
        └── app.js
```
