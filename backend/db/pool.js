const { Pool } = require('pg');
require('dotenv').config();

let connectionString = process.env.DATABASE_URL;

// Fix "postgresql://" → "postgres://"
if (connectionString && connectionString.startsWith("postgresql://")) {
  connectionString = connectionString.replace("postgresql://", "postgres://");
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false } // required for Supabase/Render hosted DBs
});

module.exports = pool;
