const pool = require('../db/pool');

exports.addMemberByPhone = async (req, res) => {
  const { phone, group_id, role } = req.body;
  if (!phone || !group_id || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Convert to 254 format if necessary
    const formattedPhone = phone;

    const userRes = await pool.query(
      'SELECT user_id, full_name FROM users WHERE phone_number = $1',
      [formattedPhone]
    );

    if (!userRes.rowCount) {
      return res.status(404).json({ error: 'User not found with that phone number' });
    }

    const user_id = userRes.rows[0].user_id;
    const full_name = userRes.rows[0].full_name;

    // Check if group allows new members
    const groupRes = await pool.query(
      'SELECT membership_open FROM groups WHERE group_id = $1',
      [group_id]
    );

    if (!groupRes.rowCount || groupRes.rows[0].membership_open === false) {
      return res.status(403).json({ error: 'Membership is closed for this group' });
    }

    // Check if already a member
    const exists = await pool.query(
      'SELECT * FROM group_members WHERE user_id = $1 AND group_id = $2',
      [user_id, group_id]
    );

    if (exists.rowCount) {
      return res.status(409).json({ error: 'User is already a member of this group' });
    }

    const insert = await pool.query(
      `INSERT INTO group_members (user_id, group_id, role, joined_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [user_id, group_id, role]
    );

    return res.status(201).json({ ...insert.rows[0], full_name });
  } catch (err) {
    console.error('Add member error:', err);
    return res.status(500).json({ error: 'Failed to add member' });
  }
};
