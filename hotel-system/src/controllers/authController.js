const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

// Register a new Guest (user + guest subclass)
async function register(req, res) {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, password, and phone number.'
    });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Check if email already exists
    const [existing] = await connection.query('SELECT user_id FROM `user` WHERE email = ?', [email.trim().toLowerCase()]);
    if (existing.length > 0) {
      await connection.rollback();
      return res.status(409).json({ success: false, message: 'Email is already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [userResult] = await connection.query(
      'INSERT INTO `user` (name, email, password_hash) VALUES (?, ?, ?)',
      [name.trim(), email.trim().toLowerCase(), hashedPassword]
    );
    const userId = userResult.insertId;

    // Insert guest
    await connection.query(
      'INSERT INTO guest (user_id, phone) VALUES (?, ?)',
      [userId, phone.trim()]
    );

    await connection.commit();

    // Generate JWT
    const payload = {
      userId,
      email: email.trim().toLowerCase(),
      name: name.trim(),
      role: 'guest',
      phone: phone.trim()
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      user: payload
    });
  } catch (err) {
    await connection.rollback();
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  } finally {
    connection.release();
  }
}

// Login (handles both Guest and Receptionist)
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
  }

  try {
    const [users] = await pool.query('SELECT * FROM `user` WHERE email = ?', [email.trim().toLowerCase()]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = users[0];

    // Password verification: supports bcrypt, plain fallback, and demo shortcuts
    let passwordMatch = false;
    try {
      passwordMatch = await bcrypt.compare(password, user.password_hash);
    } catch (e) {
      passwordMatch = false;
    }

    if (!passwordMatch) {
      if (
        user.password_hash === password ||
        (user.password_hash.startsWith('hash_') && (password === 'demo123' || password === 'staff123')) ||
        (password === 'demo123' && user.email.includes('example.com')) ||
        (password === 'staff123' && user.email.includes('hotel.com'))
      ) {
        passwordMatch = true;
      }
    }

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Determine role and additional subclass fields
    let role = 'guest';
    let extra = {};

    const [receptionists] = await pool.query('SELECT employee_id, shift FROM receptionist WHERE user_id = ?', [user.user_id]);
    if (receptionists.length > 0) {
      role = 'receptionist';
      extra = {
        employeeId: receptionists[0].employee_id,
        shift: receptionists[0].shift
      };
    } else {
      const [guests] = await pool.query('SELECT phone FROM guest WHERE user_id = ?', [user.user_id]);
      if (guests.length > 0) {
        extra = { phone: guests[0].phone };
      }
    }

    const payload = {
      userId: user.user_id,
      email: user.email,
      name: user.name,
      role,
      ...extra
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: payload
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
}

// Get profile of authenticated user
async function getMe(req, res) {
  try {
    const userId = req.user.userId;
    const [users] = await pool.query('SELECT user_id, name, email FROM `user` WHERE user_id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const user = users[0];
    let role = req.user.role;
    let extra = {};

    if (role === 'receptionist') {
      const [rec] = await pool.query('SELECT employee_id, shift FROM receptionist WHERE user_id = ?', [userId]);
      if (rec.length > 0) {
        extra = { employeeId: rec[0].employee_id, shift: rec[0].shift };
      }
    } else {
      const [g] = await pool.query('SELECT phone FROM guest WHERE user_id = ?', [userId]);
      if (g.length > 0) {
        extra = { phone: g[0].phone };
      }
    }

    res.json({
      success: true,
      user: {
        userId: user.user_id,
        name: user.name,
        email: user.email,
        role,
        ...extra
      }
    });
  } catch (err) {
    console.error('getMe error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving profile.' });
  }
}

module.exports = {
  register,
  login,
  getMe
};
