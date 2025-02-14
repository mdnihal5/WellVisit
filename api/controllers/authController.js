const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "secret_key";

const register = async (req, res) => {
  const { name, email, password, role, availability, speciality } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (role === "doctor" && !availability) {
      return res
        .status(400)
        .json({ message: "Availability is required for doctors" });
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      availability: role === "doctor" ? availability : undefined,
      speciality: role === "doctor" ? speciality : undefined,
    });

    const savedUser = await newUser.save();

    let userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
    };

    if (savedUser.role === "doctor") {
      if (savedUser.availability) userResponse.availability = savedUser.availability;
      if (savedUser.speciality) userResponse.speciality = savedUser.speciality;
    }

    const token = jwt.sign(
      { userId: savedUser._id, role: savedUser.role },
      JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res
      .status(201)
      .json({ message: "User registered successfully", token, user: userResponse });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

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
      { expiresIn: "1h" }
    );

    let userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    if (user.role === "doctor") {
      if (user.availability) userResponse.availability = user.availability;
      if (user.speciality) userResponse.speciality = user.speciality;
    }

    res.json({ message: "Logged in successfully", token, user: userResponse });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

const logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};

module.exports = { register, login, logout };

