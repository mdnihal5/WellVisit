const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const router = express.Router();

router.post("/register", register); // Register new user
router.post("/login", login); // Login user and issue token
router.get("/logout", logout); // Logout user and clear token

module.exports = router;
