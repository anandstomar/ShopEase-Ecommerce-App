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


