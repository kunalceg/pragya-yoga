// ============================================================
// server.js — Pragya Yoga API entrypoint
// ============================================================
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import studentRoutes from './routes/student.js';
import studentsAdminRoutes from './routes/students.js';
import adminRoutes from './routes/admin.js';
import batchRoutes from './routes/batches.js';
import bookingRoutes from './routes/bookings.js';
import leadRoutes from './routes/leads.js';
import publicRoutes from './routes/public.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS ──
const allowedOrigins = (process.env.CORS_ORIGINS || 'https://pragya-yoga.vercel.app,http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // server-to-server / curl
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('Blocked by CORS policy'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

// ── Routes ──
app.get('/', (req, res) => res.json({ status: 'Pragya Yoga API is running ✅', time: new Date().toISOString() }));
app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);     // authenticated student dashboard
app.use('/api/students', studentsAdminRoutes); // admin student directory
app.use('/api/admin', adminRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/public', publicRoutes);

// ── Error handling (must be last) ──
app.use(notFound);
app.use(errorHandler);

// ── Boot ──
connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`🌐 Server running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  });

export default app;
