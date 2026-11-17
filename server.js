const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./src/config/db');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const roomRoutes = require('./src/routes/roomRoutes');
const reservationRoutes = require('./src/routes/reservationRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const roomServiceRoutes = require('./src/routes/roomServiceRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const chatbotRoutes = require('./src/routes/chatbotRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/room-service', roomServiceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Hotel Management System API'
  });
});

// Single Page Application fallback for any non-API route
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found.' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Nile House Hotel Server is running on port ${PORT}`);
  console.log(`🔗 Web UI URL:    http://localhost:${PORT}`);
  console.log(`🔗 API Base URL:  http://localhost:${PORT}/api`);
  console.log(`======================================================\n`);
  await testConnection();
});
