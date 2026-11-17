const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Guest & common endpoints
router.post('/', authenticateToken, requireRole('guest'), reservationController.createReservation);
router.get('/my', authenticateToken, requireRole('guest'), reservationController.getMyReservations);
router.get('/desk/board', authenticateToken, requireRole('receptionist'), reservationController.getDeskBoard);
router.get('/:id', authenticateToken, reservationController.getReservationById);
router.put('/:id/cancel', authenticateToken, reservationController.cancelReservation);
router.put('/:id/modify', authenticateToken, reservationController.modifyReservation);

// Receptionist specific endpoints (Sequences 3 and 4)
router.post('/:id/check-in', authenticateToken, requireRole('receptionist'), reservationController.checkInGuest);
router.post('/:id/check-out', authenticateToken, requireRole('receptionist'), reservationController.checkOutGuest);

module.exports = router;
