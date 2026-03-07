const pool = require('../config/postgresql');

async function createFullOrder({ user_id, total, payment_id, items }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create the order entry
    const { rows } = await client.query(
      `INSERT INTO orders (user_id, total, status)
       VALUES ($1, $2, 'paid')
       RETURNING id, created_at`,
      [user_id, total]
    );

    const baseOrder = rows[0];

    const itemInsertPromises = items.map(item =>
      client.query(
        `INSERT INTO order_items (order_id, product_id, quantity,payment_id)
         VALUES ($1, $2, $3 , $4)`,
        [baseOrder.id, item.product_id, item.quantity, payment_id]
      )
    );

    await Promise.all(itemInsertPromises);
    await client.query('COMMIT');

    return baseOrder;

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Flat order creation failed:', err);
    throw err;
  } finally {
    client.release();
  }
}



async function getOrdersByUserId(userId) {
  const { rows } = await pool.query(
    `SELECT id, user_id, total, status, created_at, updated_at
     FROM orders
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

async function getOrderById(orderId) {
  const { rows } = await pool.query(
    `SELECT id, status, total, created_at
     FROM orders
     WHERE id = $1`,
    [orderId]
  );
  return rows[0];
}

async function getOrderItemsByOrderId(orderId) {
  const { rows } = await pool.query(
    `SELECT product_id, quantity
     FROM order_items
     WHERE order_id = $1`,
    [orderId]
  );
  return rows;
}

async function getOrderStatusById(orderId) {
  const { rows } = await pool.query(
    `SELECT
    o.id,
    o.status,
    COALESCE(dl.last_lat, o.current_lat) AS current_lat,
    COALESCE(dl.last_lng, o.current_lng) AS current_lng,
    d.id   AS driver_id,
    d.name AS driver_name
  FROM orders o
  LEFT JOIN drivers d
    ON o.driver_id = d.id
  LEFT JOIN driver_locations dl
    ON d.id = dl.driver_id::integer
  WHERE o.id = $1`,
 [orderId]
  );
  return rows[0] || null;
}




async function createPendingOrder({ user_id, total, razorpay_order_id, items }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Create the parent order record
    const { rows } = await client.query(
      `INSERT INTO orders (user_id, total, status)
       VALUES ($1, $2, 'PENDING')
       RETURNING id, created_at`,
      [user_id, total]
    );

    const baseOrder = rows[0];

    // 2. Insert items including the razorpay_order_id for each row
    const itemInsertPromises = items.map(item =>
      client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, razorpay_order_id)
         VALUES ($1, $2, $3, $4)`,
        [baseOrder.id, item.product_id, item.quantity, razorpay_order_id]
      )
    );

    await Promise.all(itemInsertPromises);
    await client.query('COMMIT');

    return baseOrder;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Pending order creation failed:', err);
    throw err;
  } finally {
    client.release();
  }
}

async function markOrderAsPaid(razorpay_order_id, payment_id) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Find the order_id associated with this razorpay_order_id
    const findOrder = await client.query(
      `SELECT DISTINCT order_id FROM order_items WHERE razorpay_order_id = $1`,
      [razorpay_order_id]
    );

    if (findOrder.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    const mainOrderId = findOrder.rows[0].order_id;

    const orderUpdate = await client.query(
    `UPDATE orders 
    SET status = 'PAID', updated_at = NOW()
    WHERE id = $1 AND status = 'PENDING'
    RETURNING id, status, user_id`, 
    [mainOrderId]
    );

    // If 0 rows updated, it was already PAID
    if (orderUpdate.rows.length === 0) {
      await client.query('ROLLBACK');
      return null; 
    }

    // 3. Update all items with the final payment_id
    await client.query(
      `UPDATE order_items 
       SET payment_id = $1 
       WHERE razorpay_order_id = $2`,
      [payment_id, razorpay_order_id]
    );

    await client.query('COMMIT');
    return orderUpdate.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error marking order as paid:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { getOrdersByUserId, getOrderItemsByOrderId, createFullOrder, getOrderStatusById,   createPendingOrder, markOrderAsPaid, getOrderById  };
