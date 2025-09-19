// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Handles signup & login
const userRoutes = require('./routes/users'); // Handles user profile & search
const chamaRoutes = require('./routes/chamaRoutes'); // Handles chama management
const meetingRoutes = require('./routes/meetings'); // Handles meetings
const mpesaRoutes = require('./routes/mpesaRoutes'); // Handles M-Pesa integration
const reportRoutes = require('./routes/reportRoutes');
const memberRoutes = require('./routes/memberRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const pool = require('./db/pool'); // Ensure your db.js exports the pool

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chamas', chamaRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/mpesa', mpesaRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/notifications', notificationRoutes);

// Root endpoint (optional for testing)
app.get('/', (req, res) => {
  res.send('StuChama backend is running.');
});

// Health check endpoint for Render
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await pool.query('SELECT 1');
    res.status(200).json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


// Start server
const PORT = process.env.PORT || 5000;
console.log("DATABASE_URL from Render:", process.env.DATABASE_URL);


app.listen(PORT, async () => {
  try {
    // Test DB connection
    await pool.query('SELECT NOW()');
    console.log(`🟢 Connected to DB. Server running on port ${PORT}`);
  } catch (err) {
    console.error('🔴 Failed to connect to DB:', err.message);
  }
});
