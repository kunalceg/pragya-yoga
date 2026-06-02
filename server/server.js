const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user'); 

const app = express();
// 🎯 FIX: Dynamically read the environment port assigned by Choreo
const PORT = process.env.PORT || 5000;
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
// 1. 🏁 REGISTRATION ROUTE (WITH FULL ERROR CAPTURE)
// ──────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(`📥 Registration request received for: ${email}`);

    // Validation Check
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 🎯 Catch any database communication crashes early
    let existingUser;
    try {
      existingUser = await User.findOne({ email: cleanEmail });
    } catch (dbErr) {
      console.error("❌ Database lookup failed during registration:", dbErr.message);
      return res.status(500).json({ error: `Database error: ${dbErr.message}` });
    }

    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    // 🎯 Securely process the password hash
    let hashedPassword;
    try {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    } catch (hashErr) {
      console.error("❌ Bcrypt password hashing failed:", hashErr.message);
      return res.status(500).json({ error: "Failed to process encryption security parameters." });
    }

    // Initialize document matching your exact structural properties
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

    // 🎯 Attempt to save straight into your cloud collection
    try {
      await newUser.save();
      console.log(`✅ User registered successfully in Atlas: ${newUser.email}`);
      
      return res.status(201).json({
        msg: "User registered successfully!",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      });
    } catch (saveErr) {
      console.error("❌ MongoDB validation save error:", saveErr);
      return res.status(400).json({ error: `Database validation rejected save: ${saveErr.message}` });
    }

  } catch (error) {
    console.error("🔥 Global Registration Crash Exception:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// ──────────────────────────────────────────
// 2. AUTH LOGIN ROUTE
// ──────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    console.log(`📥 Login request received for: ${cleanEmail}`);

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    const isPlainTextMatch = (password === user.password);

    if (!isMatch && !isPlainTextMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.status(200).json({
      msg: "Login successful!",
      token: user.email, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "student"
      }
    });
  } catch (error) {
    console.error("Login Route Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ──────────────────────────────────────────
// 3. GET PROFILE ROUTE
// ──────────────────────────────────────────
app.get('/api/auth/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const user = await User.findOne({ email: token.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ error: "User profile not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Profile GET Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ──────────────────────────────────────────
// 4. PUT PROFILE ROUTE
// ──────────────────────────────────────────
app.put('/api/auth/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const updatedData = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email: token.toLowerCase().trim() },
      { $set: updatedData },
      { new: true }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 API Server listening cleanly at http://localhost:${PORT}`);
});