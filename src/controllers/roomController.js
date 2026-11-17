const { pool } = require('../config/db');

// List or search rooms
// Supports query params: checkIn, checkOut, type
async function getRooms(req, res) {
  const { checkIn, checkOut, type } = req.query;

  try {
    let query = 'SELECT * FROM room WHERE 1=1';
    const params = [];

    if (type && type !== 'Any') {
      query += ' AND type = ?';
      params.push(type);
    }

    query += ' ORDER BY room_number ASC';
    const [rooms] = await pool.query(query, params);

    // If dates are provided, calculate availability for those dates
    if (checkIn && checkOut) {
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);

      if (isNaN(inDate.getTime()) || isNaN(outDate.getTime()) || outDate <= inDate) {
        return res.status(400).json({
          success: false,
          message: 'Invalid check-in or check-out date. Check-out must be after check-in.'
        });
      }

      // Calculate nights
      const nights = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));

      // Find rooms that have overlapping active reservations
      const [busyRows] = await pool.query(
        `SELECT DISTINCT room_id 
         FROM reservation 
         WHERE status IN ('Pending', 'Confirmed', 'Checked-In')
           AND check_in_date < ? 
           AND ? < check_out_date`,
        [checkOut, checkIn]
      );

      const busyRoomIds = new Set(busyRows.map(r => r.room_id));

      const processedRooms = rooms.map(room => ({
        ...room,
        isAvailableForDates: !busyRoomIds.has(room.room_id),
        nights,
        totalStayPrice: Number((room.price_per_night * nights).toFixed(2))
      }));

      return res.json({
        success: true,
        count: processedRooms.length,
        checkIn,
        checkOut,
        nights,
        rooms: processedRooms
      });
    }

    res.json({
      success: true,
      count: rooms.length,
      rooms
    });
  } catch (err) {
    console.error('getRooms error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving rooms.' });
  }
}

// Get single room by ID
async function getRoomById(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM room WHERE room_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }
    res.json({ success: true, room: rows[0] });
  } catch (err) {
    console.error('getRoomById error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving room details.' });
  }
}

// Update room physical status (Receptionist only)
// Logs the update to `room_status_update`
async function updateRoomStatus(req, res) {
  const { id } = req.params;
  const { newStatus } = req.body;
  const receptionistId = req.user.userId;

  const validStatuses = ['Available', 'Occupied', 'Dirty'];
  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [roomRows] = await connection.query('SELECT room_id, status FROM room WHERE room_id = ?', [id]);
    if (roomRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    // Update room status
    await connection.query('UPDATE room SET status = ? WHERE room_id = ?', [newStatus, id]);

    // Insert log into room_status_update table
    await connection.query(
      'INSERT INTO room_status_update (receptionist_id, room_id, new_status, updated_at) VALUES (?, ?, ?, NOW())',
      [receptionistId, id, newStatus]
    );

    await connection.commit();

    res.json({
      success: true,
      message: `Room status updated to ${newStatus}.`,
      roomId: Number(id),
      newStatus
    });
  } catch (err) {
    await connection.rollback();
    console.error('updateRoomStatus error:', err);
    res.status(500).json({ success: false, message: 'Server error updating room status.' });
  } finally {
    connection.release();
  }
}

// Get room status update history log (Receptionist only)
async function getStatusLog(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT 
        l.update_id,
        l.room_id,
        r.room_number,
        r.type AS room_type,
        l.new_status,
        l.updated_at,
        u.name AS receptionist_name,
        rec.employee_id
       FROM room_status_update l
       JOIN room r ON r.room_id = l.room_id
       JOIN receptionist rec ON rec.user_id = l.receptionist_id
       JOIN \`user\` u ON u.user_id = rec.user_id
       ORDER BY l.updated_at DESC
       LIMIT 50`
    );

    res.json({ success: true, count: rows.length, log: rows });
  } catch (err) {
    console.error('getStatusLog error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving status log.' });
  }
}

module.exports = {
  getRooms,
  getRoomById,
  updateRoomStatus,
  getStatusLog
};
