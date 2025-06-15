const express = require('express');
const router = express.Router();
const { verifyToken } = require('../Middleware/AuthMiddleware');
const {
  registerUserController,
  loginUserController,
  getCurrentUserController
} = require('../controllers/authController');

router.post('/signup', registerUserController);
router.post('/login', loginUserController);
router.get('/me', (req, res, next) => {
  
  next();
}, verifyToken, getCurrentUserController);




module.exports = router;
