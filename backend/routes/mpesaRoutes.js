// backend/routes/mpesaRoutes.js
const express = require('express');
const router  = express.Router();
const mpesaController = require('../controllers/mpesaController');

router.post('/stk-push', mpesaController.stkPush);


router.post('/callback', mpesaController.mpesaCallback);
router.post('/query',     mpesaController.queryPaymentStatus);


module.exports = router;
