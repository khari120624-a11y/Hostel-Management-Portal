const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/mess', require('./routes/messRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/visitors', require('./routes/visitorRoutes'));
app.use('/api/amenities', require('./routes/amenityRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Hostel Management System API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Auto seed check on launch
const autoSeed = async () => {
  try {
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database empty! Triggering automatic seed...');
      const seedDatabase = require('./seed');
      if (typeof seedDatabase === 'function') {
        await seedDatabase();
      }
    }
  } catch (err) {
    // If mongo not connected yet, silently ignore auto seed
  }
};
setTimeout(autoSeed, 2000);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Internal Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Hostel Management System Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api/health`);
});

