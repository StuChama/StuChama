// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// GET user notifications
router.get('/:userId', notificationController.getUserNotifications);

// PATCH to mark notification as read
router.patch('/:notificationId/read', notificationController.markNotificationAsRead);

module.exports = router;
