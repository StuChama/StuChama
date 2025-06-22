const bcrypt = require("bcrypt");
const validator = require("validator");
const { generateToken } = require("../utils/GenerateToken");
const UserModel = require("../models/UserModel");
const pool = require('../db/pool');



const registerUserController = async (req, res) => {
  const { full_name, email, phone_number, password, confirmPassword } = req.body;

  try {
    // Validate required fields
    if (!full_name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Validate password strength
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      return res.status(400).json({
        message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
      });
    }

    // Check for existing username
    const userExists = await UserModel.findUserByUsername(full_name);
    if (userExists) {
      return res.status(409).json({ message: "Username already in use" });
    }

    // Check for existing email
    const emailExists = await UserModel.findUserByEmail(email);
    if (emailExists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = await UserModel.createUser({
      full_name,
      email,
      phone_number,
      password: hashedPassword
    });

    // Generate token
    const token = generateToken(newUser.user_id);

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await UserModel.findUserByEmail(email);
    
    // User not found
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.user_id);

    res.status(200).json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        profile_picture: user.profile_picture
      },
      token
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



const getCurrentUserController = async (req, res) => {
  try {
    const userId = req.userId;
    

    const result = await pool.query(
      'SELECT user_id, full_name, email, phone_number, profile_picture, created_at FROM users WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = { registerUserController, loginUserController, getCurrentUserController };
