const { Pool } = require('pg');
require('dotenv').config();

let connectionString = process.env.DATABASE_URL;

if (connectionString && connectionString.startsWith("postgresql://")) {
  connectionString = connectionString.replace("postgresql://", "postgres://");
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => console.log("🟢 Connected to Supabase DB"))
  .catch(err => console.error("🔴 DB connection error:", err));


module.exports = pool;
