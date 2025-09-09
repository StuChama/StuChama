const { Pool } = require('pg');
require('dotenv').config();

let connectionString = process.env.DATABASE_URL;

// Fix Supabase's "postgresql://" → "postgres://"
if (connectionString && connectionString.startsWith("postgresql://")) {
  connectionString = connectionString.replace("postgresql://", "postgres://");
}

if (!connectionString) {
  console.error("❌ DATABASE_URL is not defined!");
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
