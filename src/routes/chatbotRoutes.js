const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Guest chat endpoints
router.post('/message', authenticateToken, chatbotController.sendInquiry);
router.get('/history', authenticateToken, chatbotController.getGuestHistory);
router.post('/escalate', authenticateToken, chatbotController.escalateLatest);

// Receptionist escalated chat endpoints
router.get('/escalated', authenticateToken, requireRole('receptionist'), chatbotController.getEscalatedChats);
router.post('/:id/reply', authenticateToken, requireRole('receptionist'), chatbotController.replyToChat);

module.exports = router;
