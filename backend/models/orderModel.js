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




// async function createOrder({ user_id, total, paymentId }) {
//   const { rows } = await pool.query(
//     `INSERT INTO orders (user_id, total, status, payment_id)
//      VALUES ($1, $2, 'paid', $3)
//      RETURNING id, created_at`,
//     [user_id, total, paymentId]
//   );
//   return rows[0];
// }

// async function createOrderItem({ id, product_ids, quantity }) {
//   await pool.query(
//     `INSERT INTO order_items (id, product_ids, quantity)
//      VALUES ($1, $2, $3)`,
//     [id, product_ids, quantity]
//   );
// }
// module.exports = { createOrder, createOrderItem };

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

async function getOrderItemsByOrderId(orderId) {
  const { rows } = await pool.query(
    `SELECT product_id, quantity
     FROM order_items
     WHERE order_id = $1`,
    [orderId]
  );
  return rows;
}

module.exports = { getOrdersByUserId, getOrderItemsByOrderId, createFullOrder };

// const getOrdersByUser = async (userId) => {
//   const result = await pool.query(
//     `
//     SELECT
//       id,
//       total,
//       status,
//       created_at,
//       product_ids
//     FROM orders
//     WHERE user_id = $1
//     ORDER BY created_at DESC
//     `,
//     [userId]
//   );
//   return result.rows;
// };

// async function getOrdersByUserId(userId) {
//   const { rows } = await pool.query(
//     `SELECT 
//        o.id,
//        o.user_id,
//        o.product_ids,
//        o.total,
//        o.status,
//        o.created_at,
//        o.updated_at
//      FROM orders o
//      WHERE o.user_id = $1
//      ORDER BY o.created_at DESC`,
//     [userId]
//   );
//   return rows;
// }




// const getOrdersByUser = async (userId) => {
//   const result = await pool.query('SELECT * FROM orders WHERE user_id = $1', [userId]);
//   return result.rows;
// };

// const getOrdersByUser = async (userId) => {
//   const result = await pool.query(
//     SELECT o.id, o.total, o.status, o.created_at,
//             json_agg(json_build_object(
//               'product_id', p.product_id,
//               'quantity', p.quantity
//             )) AS items
//      FROM orders o
//      JOIN order_items p ON p.order_id = o.id
//      WHERE o.user_id = $1
//      GROUP BY o.id
//      ORDER BY o.created_at DESC,
//     [userId]
//   );
//   return result.rows;
// }; 