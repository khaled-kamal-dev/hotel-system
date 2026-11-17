const { pool } = require('../config/db');

// Submit a review for a completed stay
async function submitReview(req, res) {
  const { reservationId, rating, comment } = req.body;
  const guestId = req.user.userId;

  const numRating = Number(rating);
  if (!reservationId || !numRating || numRating < 1 || numRating > 5) {
    return res.status(400).json({ success: false, message: 'Reservation ID and rating between 1 and 5 are required.' });
  }

  try {
    const [resRows] = await pool.query(
      'SELECT reservation_id, guest_id, status FROM reservation WHERE reservation_id = ?',
      [reservationId]
    );

    if (resRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Reservation not found.' });
    }

    const reservation = resRows[0];
    if (reservation.guest_id !== guestId) {
      return res.status(403).json({ success: false, message: 'You can only review your own stay.' });
    }

    // Reservation must be completed/checked-out
    const allowedStatuses = ['Checked-Out', 'Completed', 'COMPLETED'];
    if (!allowedStatuses.includes(reservation.status)) {
      return res.status(400).json({
        success: false,
        message: `Reviews can only be submitted after check-out (Current status: ${reservation.status}).`
      });
    }

    // Check if review already exists
    const [existing] = await pool.query('SELECT review_id FROM review WHERE reservation_id = ?', [reservationId]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'A review has already been submitted for this stay.' });
    }

    const [result] = await pool.query(
      'INSERT INTO review (reservation_id, guest_id, rating, comment, review_date) VALUES (?, ?, ?, ?, CURRENT_DATE)',
      [reservationId, guestId, numRating, comment ? comment.trim() : null]
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. Thank you for your feedback!',
      reviewId: result.insertId,
      rating: numRating,
      comment
    });
  } catch (err) {
    console.error('submitReview error:', err);
    res.status(500).json({ success: false, message: 'Server error submitting review.' });
  }
}

// Get all reviews
async function getReviews(req, res) {
  try {
    const [reviews] = await pool.query(
      `SELECT 
        r.review_id,
        r.reservation_id,
        r.rating,
        r.comment,
        DATE_FORMAT(r.review_date, '%Y-%m-%d') AS review_date,
        u.name AS guest_name,
        rm.room_number,
        rm.type AS room_type
       FROM review r
       JOIN \`user\` u ON u.user_id = r.guest_id
       JOIN reservation res ON res.reservation_id = r.reservation_id
       JOIN room rm ON rm.room_id = res.room_id
       ORDER BY r.review_date DESC, r.review_id DESC
       LIMIT 30`
    );

    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    console.error('getReviews error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving reviews.' });
  }
}

module.exports = {
  submitReview,
  getReviews
};
