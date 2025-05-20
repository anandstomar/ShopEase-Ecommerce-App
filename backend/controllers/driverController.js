const pool = require('../config/postgresql');
const {  getIO } = require('../config/socketio');

async function assignDriverController(orderId, driverId) {
    const driver = await getDriverById(driverId);
    if (!driver) {
      throw new Error(`No such driver: ${driverId}`);
    }
    try {
    await pool.query(
      'UPDATE orders SET driver_id = $1 WHERE id = $2',
      [driverId, orderId]
    );  
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  
//   async function updateLocationController(req, res) {
//     const { driverId, lat, lng, orderId } = req.body;
//     try {
//       // update drivers table (optional)
//       await pool.query(
//         'UPDATE drivers SET last_seen = NOW() WHERE id = $1',
//         [driverId]
//       );
  
//       if (orderId) {
//         // write directly to order for quick tracking
//         await pool.query(
//           'UPDATE orders SET current_lat = $1, current_lng = $2 WHERE id = $3',
//           [lat, lng, orderId]
//         );
//       }
//       res.json({ success: true });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }

async function updateLocationController(req, res) {
  const { driverId } = req.params;
  const { lat, lng } = req.body;

  // 1️⃣ Validate input
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'Invalid latitude or longitude' });
  }

  try {
    // 2️⃣ Upsert into driver_locations
    await pool.query(
      `INSERT INTO driver_locations (driver_id, last_lat, last_lng, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (driver_id)
       DO UPDATE SET last_lat = EXCLUDED.last_lat,
                     last_lng = EXCLUDED.last_lng,
                     updated_at = NOW()`,
      [driverId, lat, lng]
    );

    // 3️⃣ Also propagate into orders.current_lat/current_lng
    await pool.query(
      `UPDATE orders
         SET current_lat = $1,
             current_lng = $2
       WHERE driver_id = $3`,
      [lat, lng, driverId]
    );

    // 4️⃣ Emit update via WebSocket
    const io = getIO();
    io.to(`driver_${driverId}`)
      .emit('locationUpdate', { driverId, lat, lng });

    return res.sendStatus(200);
  } catch (err) {
    console.error('Driver location save failed:', err);
    return res.status(500).json({ error: 'Could not save location' });
  }
}


  module.exports = {
    assignDriverController,
    updateLocationController
  };