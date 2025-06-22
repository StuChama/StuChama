// === routes/chamaRoutes.js ===
const express = require('express');
const router = express.Router();
const {
    getAllGroups,
  getChamaById,
  getChamaMembers,
  getChamaFines,
  addFine,
    createChama,
    joinChama,
    getChamaGoals,
    getChamaContributions,
    updateMemberRole,
    removeMember,
    getUserChamas,
    getUserMembership,
  getChamaRules,
  getMemberGroupDetails,
  getGroupProgress,
  getMemberFines,
  getTransactions,
  getUserNotifications
} = require('../controllers/chamaController');

// === CHAIRPERSON ROUTES ===
router.get('/groups/goals', getChamaGoals);
router.get('/groups/:groupId', getChamaById);
router.get('/groups/:groupId/members', getChamaMembers);

router.get('/groups/:groupId/fines', getChamaFines);
router.post('/groups/:groupId/fines', addFine);
// routes/chamaRoutes.js or wherever you define routes
router.get('/rules', getChamaRules);
router.patch('/groups/members/:memberId', updateMemberRole);
router.delete('/groups/members/:memberId', removeMember);
router.post('/groups/members', joinChama);


// === MEMBER ROUTES ===
router.get('/groups', getAllGroups);
router.get('/member/groups/:groupId', getMemberGroupDetails);
router.get('/member/groups/:groupId/progress', getGroupProgress);
router.get('/member/groups/:groupId/fines/:userId', getMemberFines);

// === TREASURER ROUTES ===
router.get('/transactions', getTransactions);

// === NOTIFICATIONS ===
router.get('/notifications/:userId', getUserNotifications);

router.post('/groups', createChama);
router.post('/group_members', joinChama);
router.get('/user/:userId', getUserChamas);
router.get('/groups/:groupId/members/:userId', getUserMembership);

router.get('/groups/contributions', getChamaContributions);



module.exports = router;