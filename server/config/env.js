import dotenv from 'dotenv';
dotenv.config();

const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/rabab',
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@majesticrabab.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'RababAdmin2026',
};

export default env;
