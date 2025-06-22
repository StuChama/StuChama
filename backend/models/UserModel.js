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
     RETURNING user_id, full_name, email, phone_number, profile_picture`,
    [full_name, email, phone_number, profile_picture || null, password]
  );
  return result.rows[0];
};

const updateUser = async (userId, { full_name, email, phone_number }) => {
  const result = await pool.query(
    `UPDATE users
     SET full_name = $1, email = $2, phone_number = $3
     WHERE user_id = $4
     RETURNING user_id, full_name, email, phone_number`,
    [full_name, email, phone_number, userId]
  );
  return result.rows[0];
};


module.exports = {
  findUserByEmail,
  findUserByUsername,
  createUser,
  updateUser
};
