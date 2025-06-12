const bcrypt = require("bcrypt");
const validator = require("validator");
const { generateToken } = require("../utils/GenerateToken");
const UserModel = require("../models/UserModel");

const registerUserController = async (req, res) => {
  const { full_name, email, phone_number, password } = req.body;

  try {
    // Check for existing username
    const userExists = await UserModel.findUserByUsername(full_name);
    if (userExists) return res.status(400).json({ message: "Username already in use" });

    // Check for existing email
    const emailExists = await UserModel.findUserByEmail(email);
    if (emailExists) return res.status(400).json({ message: "Email already in use" });

    // Validate email
    if (!validator.isEmail(email)) return res.status(400).json({ message: "Invalid email" });

    // Validate password
    if (!validator.isStrongPassword(password))
      return res.status(400).json({ message: "Password must be at least 8 characters, with one uppercase letter, one lowercase letter, one number, and one special character." });

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

    // Token
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
    if (!email || !password)
      return res.status(400).json({ message: "Please fill in all fields" });

    const user = await UserModel.findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user.user_id);

    res.status(200).json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { registerUserController, loginUserController };
