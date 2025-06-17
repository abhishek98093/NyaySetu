require('dotenv').config();
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL is not set in .env file");
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Required for many cloud-hosted PostgreSQL (like Neon, Supabase, etc.)
  },
});

client.connect()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error(`❌ Error connecting to the database:`, error.stack);
  });

module.exports = client;
