const pool = require('../config/postgresql');
const { getIO } = require('../config/socketio');

// 1. Assign Driver (Standard)
async function assignDriverController(req, res) {
  const { orderId, driverId } = req.body;
  try {
    // Verify driver exists
    const driverCheck = await pool.query('SELECT id FROM drivers WHERE id = $1', [driverId]);
    if (driverCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Assign
    await pool.query(
      'UPDATE orders SET driver_id = $1, status = $2 WHERE id = $3',
      [driverId, 'assigned', orderId]
    );

    // Notify User
    getIO().to(`order_${orderId}`).emit('driverAssigned', { driverId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 2. Update Location (Standard Math Version)
async function updateLocationController(req, res) {
  const { driverId } = req.params;
  const { lat, lng, status } = req.body;

  if (!lat || !lng) return res.status(400).json({ error: 'Invalid coordinates' });

  try {
    const query = `
      INSERT INTO driver_locations (driver_id, last_lat, last_lng, status, updated_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (driver_id)
      DO UPDATE SET 
        last_lat = EXCLUDED.last_lat,
        last_lng = EXCLUDED.last_lng,
        status = EXCLUDED.status,
        updated_at = NOW()
    `;

    await pool.query(query, [driverId, lat, lng, status || 'online']);

    // Emit live update
    getIO().to(`driver_${driverId}`).emit('driverLocation', { driverId, lat, lng });
    
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update location' });
  }
}

// 3. Find Nearest Drivers (The "Haversine" Magic - No PostGIS needed!)
async function findNearestDrivers(req, res) {
  const { lat, lng } = req.query;

  try {
    // 6371 is the radius of Earth in km.
    // This formula calculates distance between two lat/lng points.
    const query = `
      SELECT 
        driver_id,
        status,
        (
          6371 * acos(
            cos(radians($1)) * cos(radians(last_lat)) *
            cos(radians(last_lng) - radians($2)) +
            sin(radians($1)) * sin(radians(last_lat))
          )
        ) AS distance_km
      FROM driver_locations
      WHERE status = 'online'
      ORDER BY distance_km ASC
      LIMIT 10;
    `;

    const result = await pool.query(query, [lat, lng]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Calculation failed' });
  }
}

module.exports = { assignDriverController, updateLocationController, findNearestDrivers };










// const pool = require('../config/postgresql');
// const {  getIO } = require('../config/socketio');

// async function assignDriverController(orderId, driverId) {
//     const driver = await getDriverById(driverId);
//     if (!driver) {
//       throw new Error(`No such driver: ${driverId}`);
//     }
//     try {
//     await pool.query(
//       'UPDATE orders SET driver_id = $1 WHERE id = $2',
//       [driverId, orderId]
//     );  
//       res.json({ success: true });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }
  
// //   async function updateLocationController(req, res) {
// //     const { driverId, lat, lng, orderId } = req.body;
// //     try {
// //       // update drivers table (optional)
// //       await pool.query(
// //         'UPDATE drivers SET last_seen = NOW() WHERE id = $1',
// //         [driverId]
// //       );
  
// //       if (orderId) {
// //         // write directly to order for quick tracking
// //         await pool.query(
// //           'UPDATE orders SET current_lat = $1, current_lng = $2 WHERE id = $3',
// //           [lat, lng, orderId]
// //         );
// //       }
// //       res.json({ success: true });
// //     } catch (err) {
// //       res.status(500).json({ error: err.message });
// //     }
// //   }

// async function updateLocationController(req, res) {
//   const { driverId } = req.params;
//   const { lat, lng } = req.body;

//   // 1️⃣ Validate input
//   if (typeof lat !== 'number' || typeof lng !== 'number') {
//     return res.status(400).json({ error: 'Invalid latitude or longitude' });
//   }

//   try {
//     // 2️⃣ Upsert into driver_locations
//     await pool.query(
//       `INSERT INTO driver_locations (driver_id, last_lat, last_lng, updated_at)
//        VALUES ($1, $2, $3, NOW())
//        ON CONFLICT (driver_id)
//        DO UPDATE SET last_lat = EXCLUDED.last_lat,
//                      last_lng = EXCLUDED.last_lng,
//                      updated_at = NOW()`,
//       [driverId, lat, lng]
//     );

//     // 3️⃣ Also propagate into orders.current_lat/current_lng
//     await pool.query(
//       `UPDATE orders
//          SET current_lat = $1,
//              current_lng = $2
//        WHERE driver_id = $3`,
//       [lat, lng, driverId]
//     );

//     // 4️⃣ Emit update via WebSocket
//     const io = getIO();
//     io.to(`driver_${driverId}`)
//       .emit('locationUpdate', { driverId, lat, lng });

//     return res.sendStatus(200);
//   } catch (err) {
//     console.error('Driver location save failed:', err);
//     return res.status(500).json({ error: 'Could not save location' });
//   }
// }


//   module.exports = {
//     assignDriverController,
//     updateLocationController
//   };