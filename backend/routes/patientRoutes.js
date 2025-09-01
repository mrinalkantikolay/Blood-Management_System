// backend/routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');
const { donorPatientValidation } = require('../middleware/validators');
const { validationResult } = require('express-validator');

// Use validation middleware as an array directly
const patientValidationMiddleware = donorPatientValidation;

// GET all patients (protected route)
router.get('/', authenticateToken, (req, res) => {
  db.query('SELECT * FROM patients', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// POST add new patient (protected route)
router.post('/', authenticateToken, patientValidationMiddleware, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, blood_group, age, contact, address } = req.body;
  const user_id = req.user.id;
  db.query(
    'INSERT INTO patients (name, blood_group, age, contact, address, user_id) VALUES (?, ?, ?, ?, ?, ?)',
    [name, blood_group, age, contact, address, user_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json({ patientId: result.insertId });
    }
  );
});

module.exports = router;