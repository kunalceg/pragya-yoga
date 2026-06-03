const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const transporter = require("../mailer");

// ==========================================
// 🛡️ AUTH MIDDLEWARE DEFINITION
// ==========================================
function authMiddleware(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains { id: user._id }
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid or has expired" });
  }
}

// ==========================================
// 📑 EXISTING USER AUTH ROUTES
// ==========================================

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Pragya Yoga",
      text: `Hello ${name},\n\nYour registration was successful!`
    });

    res.json({ msg: "User registered successfully." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ msg: "Login successful", token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `Reset link: ${resetLink}`
    });
    res.json({ msg: "Link sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 👤 GET PROFILE — loads student data on dashboard open
// ==========================================
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// ✏️ UPDATE PROFILE — saves edits to MongoDB
// ==========================================
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, city, style, level } = req.body;

    const updatedFields = {};
    if (name  !== undefined) updatedFields.name  = name;
    if (phone !== undefined) updatedFields.phone = phone;
    if (city  !== undefined) updatedFields.city  = city;
    if (style !== undefined) updatedFields.style = style;
    if (level !== undefined) updatedFields.level = level;

    // 🔒 Security: Check if the new email is already taken by a different user
    if (email !== undefined) {
      const emailOwner = await User.findOne({ email });
      if (emailOwner && emailOwner._id.toString() !== req.user.id) {
        return res.status(400).json({ error: "Email is already in use by another account" });
      }
      updatedFields.email = email;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updatedFields },
      { new: true, runValidators: true } // 'new: true' is the standard alias for returnDocument: "after"
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json(updatedUser); 
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Could not update profile" });
  }
});

// ==========================================
// 📦 COMBINED MODULE EXPORTS (FIXED)
// ==========================================
router.authMiddleware = authMiddleware; // Attach it directly to the router instance
module.exports = router;