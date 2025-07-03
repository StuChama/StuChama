const pool = require('../db/pool');


// === controllers/chamaController.js ===
const ChairpersonChamaModel = require('../models/ChairpersonChamaModel');
const MemberChamaModel = require('../models/MemberChamaModel');
const TreasurerChamaModel = require('../models/TreasurerChamaModel');

// === CHAIRPERSON CONTROLLERS ===

const getChamaGoals = async (req, res) => {
  const groupId = req.query.group_id;

  if (!groupId) {
    return res.status(400).json({ error: 'Missing group_id in query parameters' });
  }

  try {
    const goals = await ChairpersonChamaModel.getChamaGoals(groupId);
    return res.status(200).json(goals);
  } catch (error) {
    console.error('Failed to fetch chama goals:', error);
    return res.status(500).json({ error: 'Internal server error while fetching goals' });
  }
};

const getChamaContributions = async (req, res) => {
  const { goal_id, user_id } = req.query;

  try {
    if (!goal_id) {
      return res.status(400).json({ error: 'Missing goal_id' });
    }

    let contributions;
    if (user_id) {
      // Get specific user's contributions to a goal
      contributions = await ChairpersonChamaModel.getAllContributionsToGoal(goal_id, user_id);

    } else {
      // Get all contributions to a goal
      contributions = await ChairpersonChamaModel.getAllContributionsToGoal(goal_id);

    }

    res.json(contributions);
  } catch (error) {
    console.error('Error fetching contributions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getChamaById = async (req, res) => {
  try {
    const group = await ChairpersonChamaModel.getChamaById(req.params.groupId);
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group details' });
  }
};

const getChamaMembers = async (req, res) => {
  try {
    const members = await ChairpersonChamaModel.getChamaMembers(req.params.groupId);
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
};

const getChamaFines = async (req, res) => {
  try {
    const fines = await ChairpersonChamaModel.getChamaFines(req.params.groupId);
    res.json(fines);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fines' });
  }
};

const getUserFines = async (req, res) => {
  const group_id = req.params.groupId; // Get group_id from route params
  const { user_id, status } = req.query;

  if (!user_id || !group_id) {
    return res.status(400).json({ error: 'Missing user_id or group_id' });
  }

  try {
    const fines = await ChairpersonChamaModel.getFinesByUser(user_id, group_id, status);
    res.json(fines);
  } catch (err) {
    console.error('Error fetching user fines:', err);
    res.status(500).json({ error: 'Failed to fetch fines' });
  }
};

const getAllGroups = async (req, res) => {
  try {
    const groups = await ChairpersonChamaModel.getAllChamas();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};

const addFine = async (req, res) => {
  const { user_id, amount, reason, status = 'Unpaid' } = req.body;

  if (!user_id || !amount || !reason) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newFine = await ChairpersonChamaModel.addFine(
      req.params.groupId,
      user_id,
      { amount, reason, status }
    );
    res.status(201).json(newFine);
  } catch (error) {
    console.error('Error adding fine:', error);
    res.status(500).json({ error: 'Failed to add fine' });
  }
};

// chamaController.js
const updateFineStatus = async (req, res) => {
  const { fineId } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE fines SET status = $1 WHERE fine_id = $2 RETURNING *`,
      [status, fineId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateFineDetails = async (req, res) => {
  const { fineId } = req.params;
  const { amount, reason, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE fines SET amount = $1, reason = $2, status = $3 WHERE fine_id = $4 RETURNING *`,
      [amount, reason, status, fineId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteFine = async (req, res) => {
  const { fineId } = req.params;
  try {
    await pool.query(`DELETE FROM fines WHERE fine_id = $1`, [fineId]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getChamaRules = async (req, res) => {
  const { groupId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM rules WHERE group_id = $1 ORDER BY created_at ASC`,
      [groupId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching rules:', error);
    res.status(500).json({ error: 'Failed to fetch rules' });
  }
};


const addChamaRule = async (req, res) => {
  const { groupId } = req.params;
  const { rule_description, created_by } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO rules (group_id, rule_description, created_by, created_at)
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [groupId, rule_description, created_by]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding rule:', error);
    res.status(500).json({ error: 'Failed to add rule' });
  }
};

const updateChamaRule = async (req, res) => {
  const { ruleId } = req.params;
  const { rule_description } = req.body;

  try {
    const result = await pool.query(
      `UPDATE rules SET rule_description = $1 WHERE rule_id = $2 RETURNING *`,
      [rule_description, ruleId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating rule:', error);
    res.status(500).json({ error: 'Failed to update rule' });
  }
};

const deleteChamaRule = async (req, res) => {
  const { ruleId } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM rules WHERE rule_id = $1 RETURNING *',
      [ruleId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    res.status(200).json({ message: 'Rule deleted successfully' });
  } catch (err) {
    console.error('Error deleting rule:', err.message);
    res.status(500).json({ error: 'Server error while deleting rule' });
  }
};

const updateMemberRole = async (req, res) => {
  console.log("Update role req.body:", req.body);
  const { role, group_id} = req.body;

  if (!role || !group_id) {
    return res.status(400).json({ error: 'Missing role or group_id' });
  }

  try {
    const result = await pool.query(
      `UPDATE group_members SET role = $1 WHERE user_id = $2 AND group_id = $3 RETURNING *`,
      [role, req.params.memberId, group_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Member not found in this group' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const removeMember = async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM group_members WHERE user_id = $1 RETURNING *`,
      [req.params.memberId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getMemberGroupDetails = async (req, res) => {
  try {
    const group = await MemberChamaModel.getGroupDetails(req.params.groupId);
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch member group details' });
  }
};

const getGroupProgress = async (req, res) => {
  try {
    const progress = await MemberChamaModel.getGroupProgress(req.params.groupId);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group progress' });
  }
};

const getMemberFines = async (req, res) => {
  try {
    const fines = await MemberChamaModel.getMyFines(
      req.params.groupId,
      req.params.userId
    );
    res.json(fines);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch member fines' });
  }
};


const getTransactions = async (req, res) => {
  const { group_id } = req.query;
  try {
    const txns = await TreasurerChamaModel.getGroupTransactions(group_id);
    res.json(txns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// === NOTIFICATIONS CONTROLLER ===
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await MemberChamaModel.getUserNotifications(req.params.userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

const createChama = async (req, res) => {
  try {
    const { group_name, description, created_by, group_code } = req.body;
    // 1️⃣ Create the group
    const newGroup = await ChairpersonChamaModel.createChama({
      group_name,
      description,
      created_by,
      group_code
    });

    
    await pool.query(
      `INSERT INTO group_members
         (user_id, group_id, role)
       VALUES ($1, $2, 'Chairperson')`,
      [created_by, newGroup.group_id]
    );

    res.status(201).json(newGroup);
  } catch (error) {
    console.error('Create chama error:', error);
    res.status(500).json({ error: 'Failed to create chama' });
  }
};

const getUserChamas = async (req, res) => {
  const { userId } = req.params;
  try {
    const chamas = await ChairpersonChamaModel.getUserChamas(userId);
    res.json(chamas);
  } catch (error) {
    console.error('Get user chamas error:', error);
    res.status(500).json({ error: 'Failed to fetch user chamas' });
  }
};

// Get a specific user's role in a chama group
const getUserMembership = async (req, res) => {
  const { groupId, userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT user_id, group_id, role FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found in this group' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user membership:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Join chama controller
const joinChama = async (req, res) => {
  const { group_id, group_code, user_id, role = 'Member' } = req.body;

  // 1) Find the group by ID or code
  let queryText, params;
  if (group_id) {
    queryText = 'SELECT group_id, membership_open FROM groups WHERE group_id = $1';
    params    = [group_id];
  } else if (group_code) {
    queryText = 'SELECT group_id, membership_open FROM groups WHERE group_code = $1';
    params    = [group_code];
  } else {
    return res.status(400).json({ message: 'Missing group identifier.' });
  }

  const { rows: groups } = await pool.query(queryText, params);
  if (groups.length === 0) {
    return res.status(404).json({ message: 'Group not found.' });
  }
  const group = groups[0];

  // 2) Check if group is open
  if (!group.membership_open) {
    return res.status(403).json({ message: 'This group is closed for new members.' });
  }

  // 3) Insert with dynamic role
  try {
    await pool.query(
      `INSERT INTO group_members (user_id, group_id, role)
         VALUES ($1, $2, $3)`,
      [user_id, group.group_id, role]
    );
    return res.status(200).json({ message: `Joined successfully as ${role}!` });
  } catch (err) {
    console.error('Error adding member:', err);
    return res.status(500).json({ message: 'Error joining group.' });
  }
};

const getPaymentSchedule = async (req, res) => {
  try {
    const { group_id } = req.params;
    const result = await pool.query(
      `SELECT schedule_id,
              installment_no,
              to_char(due_date, 'YYYY-MM-DD') AS due_date,
              amount_per_member
         FROM payment_schedule
        WHERE group_id = $1
        ORDER BY installment_no`,
      [group_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching schedule:', err);
    res.status(500).json({ message: 'Failed to load payment schedule.' });
  }
}

module.exports = {
  getChamaGoals,
  getAllGroups,
  getChamaById,
  getChamaMembers,
  updateMemberRole,
  removeMember,
  getChamaGoals,
  updateFineStatus,
  updateFineDetails,
  deleteFine,
  getUserFines,

  getUserChamas,
  getChamaFines,
  getUserMembership,
  getChamaContributions,
  
  addFine,
  createChama,
  joinChama,
  getChamaRules,
  addChamaRule,
  updateChamaRule,
  deleteChamaRule,
  getMemberGroupDetails,
  getGroupProgress,
  getMemberFines,
  getTransactions,
  getPaymentSchedule,
  getUserNotifications,
};
