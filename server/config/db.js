// ============================================================
// config/db.js — MongoDB connection helper
// ============================================================
import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri) throw new Error('MONGO_URI is not configured in server/.env');
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { retryWrites: false, w: 1, serverSelectionTimeoutMS: 10000 });
  console.log(`🚀 Connected to MongoDB (${mongoose.connection.name})`);
  return mongoose.connection;
}

export default connectDB;
