const pool = require('../db/pool');
const validator = require("validator");
const UserModel = require("../models/UserModel");

const updateProfilePicture = async (req, res) => {
  const { userId } = req.params;

  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET profile_picture = $1 WHERE user_id = $2 RETURNING *',
      [req.file.path, userId]
    );

    res.json({ message: 'Profile picture updated', user: result.rows[0] });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Failed to update profile picture' });
  }
};

// Add this to your user controller
const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { full_name, email, phone_number } = req.body;

  try {
    // Validate input
    if (!full_name || !email) {
      return res.status(400).json({ message: 'Full name and email are required' });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if email is already in use by another user
    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser && existingUser.user_id !== parseInt(userId)) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Update user in database
    const updatedUser = await UserModel.updateUser(parseInt(userId), {
      full_name,
      email,
      phone_number
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { updateProfilePicture , updateUserProfile };
