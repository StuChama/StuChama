const express = require('express');
const router = express.Router();
const {
  registerUserController,
  loginUserController
} = require('../controllers/authController');

router.post('/signup', registerUserController);
router.post('/login', loginUserController);

module.exports = router;
