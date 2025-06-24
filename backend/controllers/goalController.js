// controllers/goalController.js
const pool = require('../db/pool');

const getGoalsByGroup = async (req, res) => {
  const { group_id } = req.query;
  if (!group_id) return res.status(400).json({ error: 'Missing group_id' });

  try {
    const result = await pool.query(`SELECT * FROM goals WHERE group_id = $1 ORDER BY created_at DESC`, [group_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching goals:', err);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
};

const createGoal = async (req, res) => {
  const { group_id, target_amount, deadline, goal_name } = req.body;

  if (!group_id || !target_amount || !deadline || !goal_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO goals (group_id, goal_name, target_amount, deadline)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [group_id, goal_name, target_amount, deadline]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create goal error:', err);
    res.status(500).json({ error: 'Failed to create goal' });
  }
};


const updateGoal = async (req, res) => {
  const { goalId } = req.params;
  const { target_amount, deadline } = req.body;

  try {
    const result = await pool.query(
      `UPDATE goals SET target_amount = $1, deadline = $2 WHERE goal_id = $3 RETURNING *`,
      [target_amount, deadline, goalId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update goal error:', err);
    res.status(500).json({ error: 'Failed to update goal' });
  }
};

const deleteGoal = async (req, res) => {
  const { goalId } = req.params;

  try {
    await pool.query(`DELETE FROM goals WHERE goal_id = $1`, [goalId]);
    res.status(204).end();
  } catch (err) {
    console.error('Delete goal error:', err);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
};

module.exports = {
  getGoalsByGroup,
  createGoal,
  updateGoal,
  deleteGoal,
};
