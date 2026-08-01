import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import env from './config/env.js';

const server = http.createServer(app);

connectDB().then(() => {
  server.listen(env.port, () => {
    console.log(`Majestic Rabab API Server running on port ${env.port}`);
  });
});

process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
