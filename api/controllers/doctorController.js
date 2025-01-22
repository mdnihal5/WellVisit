const User = require("../models/User");

const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }); // Filter users by doctor role
    res.json(doctors);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching doctors", error: err.message });
  }
};

module.exports = { getDoctors };
