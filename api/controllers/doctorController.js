const User = require("../models/User");

const getDoctors = async (req, res) => {
  try {
    // Find users with the role 'doctor'
    const doctors = await User.find({ role: "doctor" });

    // Return the list of doctors
    res.json(doctors);
  } catch (err) {
    // Handle any errors that occur during the database operation
    res.status(500).json({ message: "Error fetching doctors", error: err.message });
  }
};

module.exports = { getDoctors };
