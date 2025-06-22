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
      contributions = await ChamaModel.getUserContributionsToGoal(goal_id, user_id);
    } else {
      // Get all contributions to a goal
      contributions = await ChamaModel.getAllContributionsToGoal(goal_id);
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

const getAllGroups = async (req, res) => {
  try {
    const groups = await ChairpersonChamaModel.getAllChamas();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};

const addFine = async (req, res) => {
  const { memberId, amount, reason, due_date } = req.body;
  try {
    const newFine = await ChairpersonChamaModel.addFine(
      req.params.groupId,
      memberId,
      { amount, reason, due_date }
    );
    res.status(201).json(newFine);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add fine' });
  }
};

const getChamaRules = async (req, res) => {
  try {
    const groupId = req.query.group_id; // 👈 pull from query params
    const rules = await ChairpersonChamaModel.getChamaRules(groupId);
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rules' });
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

// === MEMBER CONTROLLERS ===
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

// === TREASURER CONTROLLER ===
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
    const newGroup = await ChairpersonChamaModel.createChama({ group_name, description, created_by, group_code });
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
  try {
    const { user_id, group_id, role } = req.body;
    const membership = await ChairpersonChamaModel.addMemberToChama({ user_id, group_id, role });
    res.status(201).json(membership);
  } catch (error) {
    console.error('Join chama error:', error);
    res.status(500).json({ error: 'Failed to join chama' });
  }
};

module.exports = {
  getChamaGoals,
  getAllGroups,
  getChamaById,
  getChamaMembers,
  updateMemberRole,
  removeMember,
  getChamaGoals,
  getUserChamas,
  getChamaFines,
  getUserMembership,
  getChamaContributions,
  getChamaRules,
  addFine,
  createChama,
  joinChama,
  getChamaRules,
  getMemberGroupDetails,
  getGroupProgress,
  getMemberFines,
  getTransactions,
  getUserNotifications,
};
