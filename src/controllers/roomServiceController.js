const { pool } = require('../config/db');

const MENU_ITEMS = [
  // ☕ Beverages
  { id: 1,  name: '☕ Mint Tea',                     category: 'Beverages',   price: 30.00  },
  { id: 2,  name: '💧 Still Water (500ml)',           category: 'Beverages',   price: 20.00  },
  { id: 3,  name: '🥤 Fresh Orange Juice',            category: 'Beverages',   price: 55.00  },
  { id: 4,  name: '☕ Nespresso Coffee',               category: 'Beverages',   price: 65.00  },
  { id: 5,  name: '🫖 Herbal Infusion',               category: 'Beverages',   price: 40.00  },
  // 🥗 Light Bites
  { id: 6,  name: '🥪 Club Sandwich',                 category: 'Light Bites', price: 130.00 },
  { id: 7,  name: '🥗 Caesar Salad',                  category: 'Light Bites', price: 95.00  },
  { id: 8,  name: '🍟 Seasoned French Fries',         category: 'Light Bites', price: 70.00  },
  { id: 9,  name: '🧀 Cheese & Crackers Board',       category: 'Light Bites', price: 110.00 },
  // 🍽️ Main Dishes
  { id: 10, name: '🥩 Grilled Beef Tenderloin',       category: 'Main Dishes', price: 320.00 },
  { id: 11, name: '🍗 Grilled Chicken Breast',        category: 'Main Dishes', price: 210.00 },
  { id: 12, name: '🍝 Penne Pasta Arrabiata',         category: 'Main Dishes', price: 155.00 },
  { id: 13, name: '🐟 Pan-Seared Nile Tilapia',       category: 'Main Dishes', price: 240.00 },
  // 🍰 Desserts
  { id: 14, name: '🍰 Chocolate Lava Cake',           category: 'Desserts',    price: 90.00  },
  { id: 15, name: '🍮 Crème Brûlée',                  category: 'Desserts',    price: 85.00  },
  { id: 16, name: '🧁 Fresh Fruit Platter',           category: 'Desserts',    price: 75.00  },
  // 🛏️ In-Room Wellness
  { id: 17, name: '🛁 Bubble Bath Amenity Kit',       category: 'Wellness',    price: 150.00 },
  { id: 18, name: '💆 In-Room Massage (60 min)',      category: 'Wellness',    price: 500.00 },
  { id: 19, name: '🌹 Romantic Rose Turndown Setup', category: 'Wellness',    price: 200.00 },
  // 🧺 Housekeeping Extras
  { id: 20, name: '👔 Express Laundry (per piece)',   category: 'Housekeeping',price: 50.00  },
  { id: 21, name: '🌿 Extra Towels & Pillows Set',   category: 'Housekeeping',price: 0.00   },
  { id: 22, name: '🧴 Luxury Toiletries Refill',     category: 'Housekeeping',price: 80.00  }
];

function getMenu(req, res) {
  res.json({ success: true, menu: MENU_ITEMS });
}

// Place a room service order
async function placeOrder(req, res) {
  const { reservationId, items, totalPrice } = req.body;
  const user = req.user;

  if (!reservationId || !items) {
    return res.status(400).json({ success: false, message: 'Reservation ID and items list are required.' });
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
    if (user.role === 'guest' && reservation.guest_id !== user.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized for this reservation.' });
    }

    if (reservation.status !== 'Checked-In') {
      return res.status(400).json({
        success: false,
        message: 'Room service can only be ordered when the guest is Checked-In.'
      });
    }

    const orderPrice = Number(totalPrice) > 0 ? Number(totalPrice) : 0;
    const itemsDescription = Array.isArray(items) ? items.join(', ') : String(items);

    const [result] = await pool.query(
      'INSERT INTO room_service_order (reservation_id, items, total_price, status, ordered_at) VALUES (?, ?, ?, ?, NOW())',
      [reservationId, itemsDescription, orderPrice, 'Placed']
    );

    res.status(201).json({
      success: true,
      message: 'Room service order placed successfully.',
      order: {
        orderId: result.insertId,
        reservationId: Number(reservationId),
        items: itemsDescription,
        totalPrice: orderPrice,
        status: 'Placed'
      }
    });
  } catch (err) {
    console.error('placeOrder error:', err);
    res.status(500).json({ success: false, message: 'Server error placing room service order.' });
  }
}

// Update order status ('Delivered' by receptionist, or 'Cancelled' by guest/receptionist)
async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Placed', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM room_service_order WHERE order_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    await pool.query('UPDATE room_service_order SET status = ? WHERE order_id = ?', [status, id]);

    res.json({
      success: true,
      message: `Order status updated to '${status}'.`,
      orderId: Number(id),
      status
    });
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    res.status(500).json({ success: false, message: 'Server error updating order status.' });
  }
}

module.exports = {
  getMenu,
  placeOrder,
  updateOrderStatus
};
