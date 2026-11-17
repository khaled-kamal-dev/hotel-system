const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', reviewController.getReviews);
router.post('/', authenticateToken, requireRole('guest'), reviewController.submitReview);

module.exports = router;
