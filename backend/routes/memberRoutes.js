const express = require('express');
const router = express.Router();
const { addMemberByPhone } = require('../controllers/memberController');

router.post('/add-by-phone', addMemberByPhone);

module.exports = router;
