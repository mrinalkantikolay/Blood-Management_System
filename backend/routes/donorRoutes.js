// backend/routes/donorRoutes.js
const express = require('express');
const { validationResult } = require('express-validator');
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');
const { donorPatientValidation } = require('../middleware/validators');

const router = express.Router();

// GET all donors (protected route)
// GET all donors (with user email and default/derived fields)
router.get('/', authenticateToken, async (req, res) => {
  const sql = `
    SELECT d.*, d.email,
      (
        SELECT DATE(MAX(donation_date))
        FROM donations dn
        WHERE dn.donor_id = d.id
      ) AS lastDonation,
      (
        SELECT COUNT(*)
        FROM donations dn
        WHERE dn.donor_id = d.id
      ) AS totalDonations,
      h.name AS hospital,
      'Eligible' AS status, TRUE AS requested, 'Pending' AS requestStatus
    FROM donors d
    LEFT JOIN hospitals h ON d.hospital_id = h.id
  `;
  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Database query error' });
  }
});

// POST new donor (protected route)
router.post('/', authenticateToken, donorPatientValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, blood_group, age, contact, address, hospital_id } = req.body;
  const user_id = req.user.id;
  try {
    const [result] = await db.query(
      'INSERT INTO donors (name, email, blood_group, age, contact, address, hospital_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, blood_group, age, contact, address, hospital_id, user_id]
    );
    res.status(201).json({ donorId: result.insertId });
  } catch (err) {
    console.error('Error inserting donor:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT update donor (protected route)
router.put('/:id', authenticateToken, donorPatientValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const id = req.params.id;
  const { name, blood_group, age, contact, address } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE donors SET name=?, blood_group=?, age=?, contact=?, address=? WHERE id=?',
      [name, blood_group, age, contact, address, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Donor not found' });
    res.json({ message: 'Donor updated' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE donor (protected route)
router.delete('/:id', authenticateToken, async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await db.query('DELETE FROM donors WHERE id=?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Donor not found' });
    res.json({ message: 'Donor deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;