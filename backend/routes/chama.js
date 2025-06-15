const express = require('express');
const router = express.Router();
const {
  createChamaController,
  getChamaController,
  getAllChamasController,
  updateChamaController,
  deleteChamaController
} = require('../controllers/chamaController');

//Get all chamas
router.get('/', getAllChamasController);
// Get a specific chama by ID
router.get('/:id', getChamaController);

module.exports = router;

