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
  getUserFines,
  updateFineStatus,
  updateFineDetails,
  deleteFine,
  getChamaRules,
  addChamaRule,
  updateChamaRule,
  deleteChamaRule,
  
  getMemberGroupDetails,
  getGroupProgress,
  getMemberFines,
  getTransactions,
  getUserNotifications
} = require('../controllers/chamaController');

const goalController = require('../controllers/goalController');

// === CHAIRPERSON ROUTES ===
router.get('/groups/goals', getChamaGoals);
router.get('/groups/contributions', getChamaContributions);

router.get('/transactions', getTransactions);

router.get('/groups/:groupId/members', getChamaMembers);

// Fines routes
router.get('/groups/:groupId/fines', getChamaFines);
router.post('/groups/:groupId/fines', addFine);
router.patch('/fines/:fineId', updateFineStatus);
router.put('/fines/:fineId', updateFineDetails);
router.delete('/fines/:fineId', deleteFine);

// Rules routes
router.get('/groups/:groupId/rules', getChamaRules);               // Fetch rules
router.post('/groups/:groupId/rules', addChamaRule);               // Add rule
router.patch('/rules/:ruleId', updateChamaRule);                   // Update rule (PATCH is best)
router.delete('/rules/:ruleId', deleteChamaRule);  

// Goals routes
router.get('/goals', goalController.getGoalsByGroup);
router.post('/goals', goalController.createGoal);
router.patch('/goals/:goalId', goalController.updateGoal);
router.delete('/goals/:goalId', goalController.deleteGoal);

//updating member routes
router.patch('/groups/members/:memberId', updateMemberRole);
router.delete('/groups/members/:memberId', removeMember);
router.post('/groups/members', joinChama);



router.get('/groups', getAllGroups);
router.get('/member/groups/:groupId', getMemberGroupDetails);
router.get('/member/groups/:groupId/progress', getGroupProgress);
router.get('/member/groups/:groupId/fines/:userId', getMemberFines);
router.get('/member/groups/:groupId/fines', getUserFines);





router.get('/notifications/:userId', getUserNotifications);

router.post('/groups', createChama);
router.post('/group_members', joinChama);
router.get('/user/:userId', getUserChamas);
router.get('/groups/:groupId/members/:userId', getUserMembership);

router.get('/groups/:groupId', getChamaById);





module.exports = router;