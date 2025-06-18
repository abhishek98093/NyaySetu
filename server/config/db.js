require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL is not set in .env file");
  process.exit(1); 
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // For Neon or other managed Postgres with SSL
  },
});

// Test the connection once at startup
pool.connect()
  .then((client) => {
    console.log('✅ Database connected successfully');
    client.release(); // Release back to pool
  })
  .catch((error) => {
    console.error('❌ Error connecting to the database:', error.stack);
    process.exit(1);
  });

// Optional: Catch runtime pool errors
pool.on('error', (err) => {
  console.error('❌ Unexpected DB pool error (runtime):', err);
});

module.exports = pool;
