const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce_db',
  password: 'Anand2003',
  port: 5432,
});

// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// })

module.exports = pool;




// const { Pool } = require('pg');
// require('dotenv').config();

// // Connect to your remote database
// const pool = new Pool({
//   connectionString: 'postgresql://ecommerce_postgres_hf9t_user:Sbzg9vapkf9RvUMzvBwHI6drvlRUQawE@dpg-d5eu9jngi27c73cc3vbg-a.singapore-postgres.render.com/ecommerce_postgres_hf9t',
//   ssl: {
//     rejectUnauthorized: false // Required for remote/cloud databases
//   }
// });

//const createTablesQuery = `
//   -- 1. Users Table
//   CREATE TABLE IF NOT EXISTS users (
//       id SERIAL PRIMARY KEY,
//       name VARCHAR(255),
//       email VARCHAR(255) UNIQUE NOT NULL,
//       password VARCHAR(255),
//       google_id VARCHAR(255) UNIQUE,
//       firebase_uid VARCHAR(255) UNIQUE,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//   );

//   -- 2. Drivers Table (Must be created before orders/locations)
//   CREATE TABLE IF NOT EXISTS drivers (
//       id SERIAL PRIMARY KEY,
//       name VARCHAR(255) NOT NULL,
//       phone VARCHAR(20),
//       status VARCHAR(50) DEFAULT 'offline'
//   );

//   -- 3. Driver Locations
//   CREATE TABLE IF NOT EXISTS driver_locations (
//       driver_id INTEGER PRIMARY KEY REFERENCES drivers(id) ON DELETE CASCADE,
//       last_lat DECIMAL(9, 6),
//       last_lng DECIMAL(9, 6),
//       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//   );

//   -- 4. Orders Table
//   CREATE TABLE IF NOT EXISTS orders (
//       id SERIAL PRIMARY KEY,
//       user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//       total DECIMAL(10, 2) NOT NULL,
//       status VARCHAR(50) DEFAULT 'pending',
//       driver_id INTEGER REFERENCES drivers(id),
//       current_lat DECIMAL(9, 6),
//       current_lng DECIMAL(9, 6),
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//   );

//   -- 5. Order Items Table
//   CREATE TABLE IF NOT EXISTS order_items (
//       id SERIAL PRIMARY KEY,
//       order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
//       product_id VARCHAR(100) NOT NULL,
//       quantity INTEGER NOT NULL,
//       payment_id VARCHAR(255)
//   );

//   -- 6. User Devices Table (Composite Key for unique tokens per user)
//   CREATE TABLE IF NOT EXISTS user_devices (
//       user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//       device_token VARCHAR(255) NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       PRIMARY KEY (user_id, device_token)
//   );
// `;

// const createTablesQuery = `DELETE FROM user_devices;`

// const createTablesQuery = `CREATE TABLE IF NOT EXISTS user_devices (
//       user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//       device_token VARCHAR(255) NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       PRIMARY KEY (user_id, device_token)
//   );`

// const initDb = async () => {
//   try {
//     console.log('⏳ Connecting to remote database...');
//     const client = await pool.connect();
    
//     console.log('⏳ Creating tables...');
//     await client.query(createTablesQuery);
    
//     console.log('✅ Success! All tables created in remote DB.');
//     client.release();
//   } catch (err) {
//     console.error('❌ Error creating tables:', err);
//   } finally {
//     await pool.end();
//   }
// };

// initDb();