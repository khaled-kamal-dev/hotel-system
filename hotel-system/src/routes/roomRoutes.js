const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', roomController.getRooms);
router.get('/status-log', authenticateToken, requireRole('receptionist'), roomController.getStatusLog);
router.get('/:id', roomController.getRoomById);
router.put('/:id/status', authenticateToken, requireRole('receptionist'), roomController.updateRoomStatus);

module.exports = router;
