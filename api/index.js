import app from '../server/app.js';
import mongoose from 'mongoose';
import env from '../server/config/env.js';

let cachedDb = null;

const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }
  const db = await mongoose.connect(env.mongoUri);
  cachedDb = db;
  return db;
};

// Vercel serverless function entrypoint
export default async function handler(req, res) {
  await connectToDatabase();
  
  // Forward the request to the Express app
  return app(req, res);
}
