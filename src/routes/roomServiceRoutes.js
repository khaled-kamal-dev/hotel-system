const express = require('express');
const router = express.Router();
const roomServiceController = require('../controllers/roomServiceController');
const { authenticateToken } = require('../middleware/auth');

router.get('/menu', roomServiceController.getMenu);
router.post('/order', authenticateToken, roomServiceController.placeOrder);
router.put('/:id/status', authenticateToken, roomServiceController.updateOrderStatus);
router.post('/:id/cancel-item', authenticateToken, roomServiceController.cancelOrderItem);

module.exports = router;
