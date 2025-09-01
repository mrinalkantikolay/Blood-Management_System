
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Update blood inventory for a hospital (replace all blood groups for that hospital)
router.post('/update_inventory', async (req, res) => {
  const { hospital_id, inventory } = req.body; // inventory: { 'A+': 4, 'B+': 2, ... }
  if (!hospital_id || typeof inventory !== 'object') {
    return res.status(400).json({ error: 'hospital_id and inventory object required' });
  }
  try {
    // Remove all old stock for this hospital
    await db.query('DELETE FROM blood_stock WHERE hospital_id = ?', [hospital_id]);
    // Insert new stock
    const values = Object.entries(inventory)
      .filter(([blood_group, quantity]) => quantity !== '' && quantity !== null && !isNaN(quantity))
      .map(([blood_group, quantity]) => [hospital_id, blood_group, Number(quantity)]);
    if (values.length > 0) {
      await db.query('INSERT INTO blood_stock (hospital_id, blood_group, quantity) VALUES ?', [values]);
    }
    res.json({ message: 'Blood inventory updated in blood_stock table' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all blood stocks (optionally by hospital)
router.get('/', (req, res) => {
  const hospital_id = req.query.hospital_id;
  let query = `SELECT bs.id, bs.blood_group, bs.quantity, h.name as hospital_name, h.location as hospital_location
               FROM blood_stock bs JOIN hospitals h ON bs.hospital_id = h.id`;
  const params = [];
  if (hospital_id) { query += ' WHERE bs.hospital_id = ?'; params.push(hospital_id); }
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Create, update, delete
router.post('/', (req, res) => {
  const { hospital_id, blood_group, quantity } = req.body;
  if (!hospital_id || !blood_group || quantity === undefined) return res.status(400).json({ error: 'hospital_id, blood_group and quantity required' });
  db.query('INSERT INTO blood_stock (hospital_id, blood_group, quantity) VALUES (?, ?, ?)', [hospital_id, blood_group, quantity], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId });
  });
});

router.get('/availability', async (req, res) => {
  const { hospital_id, blood_group } = req.query;
  if (!hospital_id || !blood_group) return res.status(400).json({ error: 'hospital_id and blood_group required' });
  const decodedBloodGroup = decodeURIComponent(blood_group);
  try {
    const [results] = await db.query('SELECT quantity FROM blood_stock WHERE hospital_id = ? AND blood_group = ?', [hospital_id, decodedBloodGroup]);
    const quantity = (results[0] && results[0].quantity) ? results[0].quantity : 0;
    res.json({ quantity });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;