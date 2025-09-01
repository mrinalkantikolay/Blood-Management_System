// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Admin registration
router.post(
  '/admin/register',
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;
    const checkQuery = 'SELECT * FROM admins WHERE username = ?';
    try {
      const [results] = await db.query(checkQuery, [username]);
      if (results.length > 0) return res.status(409).json({ error: 'Username already exists' });
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertQuery = 'INSERT INTO admins (username, password) VALUES (?, ?)';
      const [result] = await db.query(insertQuery, [username, hashedPassword]);
      res.status(201).json({ message: 'Admin registered', adminId: result.insertId });
    } catch (e) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Admin login
router.post('/login', async (req, res) => {
  console.log('Admin login route hit', req.body);
  const { username, password } = req.body;
  if (!username || !password) {
    console.log('Missing username or password');
    return res.status(400).json({ error: 'Username and password required' });
  }
  try {
    const query = 'SELECT * FROM admins WHERE username = ?';
    console.log('About to query database for admin:', username);
    const [results] = await db.query(query, [username]);
    console.log('Database query results:', results);
    if (results.length === 0) {
      console.log('No admin found with that username');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const admin = results[0];
    console.log('Admin found, checking password');
    const passwordMatch = await bcrypt.compare(password, admin.password);
    console.log('Password match result:', passwordMatch);
    if (!passwordMatch) {
      console.log('Password does not match');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ adminId: admin.id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '2h' });
    console.log('Login successful, sending token');
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Admin login: Server error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
});

// Get all donations with donor and hospital info for admin dashboard
router.get('/donations', (req, res) => {
  const sql = `
    SELECT d.id, d.blood_group, d.quantity, d.donation_date,
           donors.name AS donor_name, hospitals.name AS hospital_name
    FROM donations d
    JOIN donors ON d.donor_id = donors.id
    JOIN hospitals ON d.hospital_id = hospitals.id
    ORDER BY d.donation_date DESC
  `;
  (async () => {
    try {
      const [results] = await db.query(sql);
      res.json(results);
    } catch (err) {
      console.error('Error fetching donations:', err);
      return res.status(500).json({ error: 'Database error' });
    }
  })();
});

module.exports = router;