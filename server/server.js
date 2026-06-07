import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import batchRoutes from './routes/batches.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'https://pragya-yoga.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Blocked by CORS policy'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

const uri = process.env.MONGO_URI || "mongodb+srv://kunalnsu_db_user:Kunal%40123@kunalcluster.kk6cpbt.mongodb.net/pragyayoga?appName=KunalCluster";

mongoose.connect(uri, { retryWrites: false, w: 1 })
  .then(() => console.log("🚀 Connected to MongoDB Atlas M0!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/batches', batchRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'Pragya Yoga API is running ✅' });
});

app.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`);
});