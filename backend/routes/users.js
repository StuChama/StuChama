const express = require('express');
const multer = require('multer');
const { profilePicStorage } = require('../utils/cloudinary');
const { updateProfilePicture } = require('../controllers/userController');
const { updateUserProfile } = require('../controllers/userController');

const router = express.Router();
const upload = multer({ storage: profilePicStorage });

router.put('/:userId/profile-picture', upload.single('profile_picture'), updateProfilePicture);
router.put('/:userId/profile', updateUserProfile);


module.exports = router;
