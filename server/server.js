import http from 'http';
import { Server as SocketIO } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';
import env from './config/env.js';

const server = http.createServer(app);

// Initialize Socket.IO
const io = new SocketIO(server, {
  cors: {
    origin: env.frontendUrl,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Make io accessible to routes via req.app.get('io')
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

connectDB().then(() => {
  server.listen(env.port, () => {
    console.log(`Majestic Rabab API Server running on port ${env.port}`);
  });
});

process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
