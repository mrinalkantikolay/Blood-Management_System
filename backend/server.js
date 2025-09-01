// Top-level error handlers for debugging crashes
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
// backend/server.js

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();

// Parse JSON body first
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log('Request received:', req.method, req.url);
  next();
});

// security
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Handle CORS preflight requests
app.options('*', cors());

// rate limiter (commented out for debugging POST hang)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: { error: 'Too many requests from this IP, please try again later.' },
// });
// app.use(limiter);

// import routers
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const donorRoutes = require('./routes/donorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const bloodStockRoutes = require('./routes/bloodStockRoutes');
const staffRoutes = require('./routes/staffRoutes');
const bloodRequestsRoutes = require('./routes/bloodRequestRoutes');
const bringBloodRequestRoutes = require('./routes/bringBloodRequestRoutes');

// mount routers

// Mount routers at unique base paths to avoid conflicts
// Mount each router at a unique base path
app.use('/api/admin', adminRoutes);         // /api/admin/*
app.use('/api/users', userRoutes);          // /api/users/*
app.use('/api/donors', donorRoutes);        // /api/donors/*
app.use('/api/patients', patientRoutes);    // /api/patients/*
app.use('/api/hospitals', hospitalRoutes);  // /api/hospitals/*

app.use('/api/blood_stock', bloodStockRoutes); // /api/blood_stock/*
app.use('/api/staff', staffRoutes);         // /api/staff/*
app.use('/api/blood_requests', bloodRequestsRoutes); // /api/blood_requests/*
app.use('/api/bring_blood_requests', bringBloodRequestRoutes); // /api/bring_blood_requests/*


// simple health route
app.get('/api/test', (req, res) => res.json({ message: 'Hello from backend 🚀' }));

// Catch-all 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found', path: req.originalUrl });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});