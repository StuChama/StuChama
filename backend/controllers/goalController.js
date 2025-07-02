// controllers/goalController.js
const pool = require('../db/pool');
const { computeInstallments } = require('../utils/scheduleUtils');

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
  try {
    const { group_id, goal_name, target_amount, deadline } = req.body;

    // 1) Insert new goal
    const insertRes = await pool.query(
      `INSERT INTO goals (group_id, goal_name, target_amount, deadline)
         VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [group_id, goal_name, target_amount, deadline]
    );
    const newGoal = insertRes.rows[0];

    // 2) Lock membership
    await pool.query(
      `UPDATE groups
         SET membership_open = FALSE
       WHERE group_id = $1`,
      [group_id]
    );

    // 3) Determine periodicity based on time span
    const startDate = new Date(newGoal.created_at);
    const endDate   = new Date(newGoal.deadline);
    const diffDays  = (endDate - startDate) / (1000 * 60 * 60 * 24);

    let periodicity;
    if (diffDays >= 90)      periodicity = 'monthly';
    else if (diffDays >= 30) periodicity = 'weekly';
    else                     periodicity = 'daily';

    // 4) Count current members
    const mcRes = await pool.query(
      `SELECT COUNT(*) AS cnt
         FROM group_members
        WHERE group_id = $1`,
      [group_id]
    );
    const memberCount = parseInt(mcRes.rows[0].cnt, 10) || 1;

    // 5) Compute the installment plan
    const plan = computeInstallments({
      startDate,
      deadline: endDate,
      periodicity,
      totalGoal: parseFloat(newGoal.target_amount),
      memberCount
    });

    // 6) Persist each slot into payment_schedule
    for (let i = 0; i < plan.length; i++) {
      const { dueDate, memberAmount } = plan[i];
      await pool.query(
        `INSERT INTO payment_schedule
           (goal_id, group_id, installment_no, due_date, amount_per_member)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          newGoal.goal_id,
          group_id,
          i + 1,
          dueDate,
          memberAmount
        ]
      );
    }

    // 7) Return the newly created goal
    res.status(201).json(newGoal);

  } catch (error) {
    console.error('Error in createGoal:', error);
    res.status(500).json({ message: 'Failed to create goal.' });
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
