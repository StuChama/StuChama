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

// ✅ CORS setup
const allowedOrigins = [
  "https://stu-chama.netlify.app", // your Netlify frontend
  "http://localhost:3000"          // keep for local development
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Middleware
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

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    // Test DB connection
    await pool.query('SELECT NOW()');
    console.log(`🟢 Connected to DB. Server running on port ${PORT}`);
  } catch (err) {
    console.error('🔴 Failed to connect to DB:', err.message);
  }
});
