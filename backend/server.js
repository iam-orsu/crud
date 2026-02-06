require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./db/database');

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize database and start server
async function start() {
  try {
    await initDatabase();
    console.log('Database initialized');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
