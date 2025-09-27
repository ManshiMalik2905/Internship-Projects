const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();
const SECRET_KEY = "mySecretKey";

// Register page
router.get("/register", (req, res) => res.render("register"));

// Register user
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.send("User already exists!");

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashed });
    await newUser.save();

    res.redirect("/login");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

// Login page
router.get("/login", (req, res) => res.render("login"));

// Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.send("Invalid credentials!");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send("Invalid credentials!");

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });

    // Save token in cookie
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

module.exports = router;
