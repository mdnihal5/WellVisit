const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "secret_key";

// Register User
const register = async (req, res) => {
  const { name, email, password, role, availability } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // If role is doctor, check if availability is provided
    if (role === "doctor" && !availability) {
      return res.status(400).json({ message: "Availability is required for doctors" });
    }

    // Only include availability if role is doctor
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      availability: role === "doctor" ? availability : undefined, // Add availability only for doctors
    });

    const savedUser = await newUser.save();

    // Remove password and prepare user response
    let userResponse = {
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
    };

    // If role is doctor, add availability field
    if (savedUser.role === "doctor" && savedUser.availability) {
      userResponse.availability = savedUser.availability;
    }

    res.status(201).json({ message: "User registered successfully", user: userResponse });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};

// Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET_KEY,
      { expiresIn: "1h" },
    );

    // Set cookie for token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set this to true in production
    });

    // Prepare user response based on role
    let userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // If role is doctor, include availability
    if (user.role === "doctor" && user.availability) {
      userResponse.availability = user.availability;
    }

    res.json({ message: "Logged in successfully", token, user: userResponse });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// Logout User
const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

module.exports = { register, login, logout };
