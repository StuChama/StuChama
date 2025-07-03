// routes/reportRoutes.js

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Route to download transactions as PDF
router.get('/transactions/pdf', reportController.generateTransactionReport);

// Optional: CSV route (if still needed)


module.exports = router;
