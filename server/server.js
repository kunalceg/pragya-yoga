import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/User.js'; // Ensure .js extension is included

// Initialize environment variables
dotenv.config();

const app = express();

// 🎯 Port configuration
const PORT = process.env.PORT || 5000;

// const cors = require('cors');
app.use(cors({
  origin: 'https://pragya-yoga.vercel.app', // Front end vercel url
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

const uri = "mongodb+srv://kunalnsu_db_user:Kunal%40123@kunalcluster.kk6cpbt.mongodb.net/pragyayoga?appName=KunalCluster";

// Connect to MongoDB Atlas
mongoose.connect(uri)
  .then(() => console.log("🚀 Connected to MongoDB Cloud Atlas successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ──────────────────────────────────────────
// 1. REGISTRATION ROUTE
// ──────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: "student",
      phone: "",
      city: "",
      style: "",
      level: "",
      planMonths: 0,
      referralCount: 0,
      stats: { classes: 0, attendancePct: 0 },
      progress: { flexibility: 0, strength: 0, breathing: 0, meditation: 0 }
    });

    await newUser.save();
    return res.status(201).json({
      msg: "User registered successfully!",
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ──────────────────────────────────────────
// 2. LOGIN ROUTE
// ──────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    return res.status(200).json({
      msg: "Login successful!",
      token: user.email, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role || "student" }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ──────────────────────────────────────────
// 3. PROFILE ROUTES
// ──────────────────────────────────────────
app.get('/api/auth/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    const user = await User.findOne({ email: token.toLowerCase().trim() });
    
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put('/api/auth/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    const updatedUser = await User.findOneAndUpdate(
      { email: token.toLowerCase().trim() },
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 API Server listening at http://localhost:${PORT}`);
});