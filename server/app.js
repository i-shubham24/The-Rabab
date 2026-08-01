import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import env from './config/env.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

import menuRoutes from './routes/menuRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

import authRoutes from './routes/authRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({ origin: env.frontendUrl, credentials: true }));

// Rate Limiting: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again in 15 minutes',
});
app.use(limiter);

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Compression
app.use(compression());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/chat', chatRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('Majestic Rabab API is running...');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
