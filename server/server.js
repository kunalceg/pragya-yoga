const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ==========================================
// 1. MIDDLEWARE SETUP
// ==========================================
// Configured to explicitly permit full resource access to your Vite development server
app.use(cors({ 
  origin: 'http://localhost:5173',
  credentials: true 
})); 
app.use(express.json());

// ==========================================
// 2. DATABASE LIFECYCLE MANAGEMENT
// ==========================================
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/Pragya_yoga";
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB connection sequence error:", err));

// ==========================================
// 3. API ROUTING GATEWAYS
// ==========================================
// Base Heartbeat Route
app.get("/", (req, res) => {
  res.send("API Engine Running Normatively");
});

// Authentication System Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Admin Workspace Management Routes (Fulfilling your 17 management modules)
const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

// ==========================================
// 4. SERVER RUNTIME LIFE CYCLE
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started safely on port ${PORT}`));