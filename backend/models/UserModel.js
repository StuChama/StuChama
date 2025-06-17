const pool = require('../db/pool');

const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const findUserByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM users WHERE full_name = $1', [username]);
  return result.rows[0];
};

const createUser = async ({ full_name, email, phone_number, password }) => {
  const result = await pool.query(
    `INSERT INTO users (full_name, email, phone_number, password)
     VALUES ($1, $2, $3, $4)
     RETURNING user_id, full_name, email, phone_number`,
    [full_name, email, phone_number || null, password]
  );
  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  findUserByUsername,
  createUser
};
