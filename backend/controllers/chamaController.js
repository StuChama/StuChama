// chamaController.js
const express = require('express');
const router = express.Router();

const ChairpersonChamaModel = require('../models/ChairpersonChamaModel');
const MemberChamaModel = require('../models/MemberChamaModel');
const TreasurerChamaModel = require('../models/TreasurerChamaModel');

// === CHAIRPERSON ROUTES ===

// Get group details by ID
router.get('/groups/:groupId', async (req, res) => {
  try {
    const group = await ChairpersonChamaModel.getChamaById(req.params.groupId);
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group details' });
  }
});

// Get members of a group
router.get('/groups/:groupId/members', async (req, res) => {
  try {
    const members = await ChairpersonChamaModel.getChamaMembers(req.params.groupId);
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Get fines for a group
router.get('/groups/:groupId/fines', async (req, res) => {
  try {
    const fines = await ChairpersonChamaModel.getChamaFines(req.params.groupId);
    res.json(fines);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fines' });
  }
});

// Add a fine
router.post('/groups/:groupId/fines', async (req, res) => {
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
});

// Get rules
router.get('/groups/:groupId/rules', async (req, res) => {
  try {
    const rules = await ChairpersonChamaModel.getChamaRules(req.params.groupId);
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rules' });
  }
});

// === MEMBER ROUTES ===

// Get group details for member
router.get('/member/groups/:groupId', async (req, res) => {
  try {
    const group = await MemberChamaModel.getGroupDetails(req.params.groupId);
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch member group details' });
  }
});

// Get group progress
router.get('/member/groups/:groupId/progress', async (req, res) => {
  try {
    const progress = await MemberChamaModel.getGroupProgress(req.params.groupId);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group progress' });
  }
});

// Get member fines
router.get('/member/groups/:groupId/fines/:userId', async (req, res) => {
  try {
    const fines = await MemberChamaModel.getMyFines(
      req.params.groupId,
      req.params.userId
    );
    res.json(fines);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch member fines' });
  }
});

// === TREASURER ROUTES ===

// Get transactions for group
router.get('/transactions', async (req, res) => {
  const { group_id } = req.query;
  try {
    const txns = await TreasurerChamaModel.getGroupTransactions(group_id);
    res.json(txns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// === NOTIFICATIONS ===

// Get notifications for user
router.get('/notifications/:userId', async (req, res) => {
  try {
    const notifications = await MemberChamaModel.getUserNotifications(req.params.userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

module.exports = router;
