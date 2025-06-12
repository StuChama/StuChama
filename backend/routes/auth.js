// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db/pool');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { full_name, email, phone_number, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone_number, password) 
       VALUES ($1, $2, $3, $4) RETURNING user_id, full_name, email`,
      [full_name, email, phone_number || null, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
