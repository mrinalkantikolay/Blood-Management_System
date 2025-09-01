
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const hospitalController = require('../controllers/hospitalController');

// Get all hospitals
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM hospitals');
    // For compatibility, ensure all results have address field
    const hospitals = results.map(h => ({ ...h, address: h.address }));
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Nearby hospitals route
router.get('/nearby', hospitalController.getNearbyHospitals);

// Get, create, update, delete
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.query('SELECT * FROM hospitals WHERE id = ?', [id]);
    if (results.length === 0) return res.status(404).json({ error: 'Hospital not found' });
    const hospital = results[0];
    res.json({ ...hospital, address: hospital.address });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, phone, pincode, latitude, longitude } = req.body;
  const address = req.body.address;
  if (!name || !address || latitude === undefined || longitude === undefined) return res.status(400).json({ error: 'Name, address, latitude, and longitude required' });
  try {
    const [result] = await db.query('INSERT INTO hospitals (name, address, phone, pincode, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)', [name, address, phone || null, pincode || null, latitude, longitude]);
    res.status(201).json({ id: result.insertId, name, address, phone, pincode, latitude, longitude });
  } catch (err) {
    console.error('Error inserting hospital:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, pincode, latitude, longitude, bloodInventory } = req.body;
  const address = req.body.address;
  try {
    let result;
    if (bloodInventory !== undefined) {
      [result] = await db.query('UPDATE hospitals SET bloodInventory = ? WHERE id = ?', [bloodInventory, id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Hospital not found' });
      res.json({ message: 'Hospital blood inventory updated' });
    } else {
      [result] = await db.query('UPDATE hospitals SET name = ?, address = ?, phone = ?, pincode = ?, latitude = ?, longitude = ? WHERE id = ?', [name, address, phone, pincode, latitude, longitude, id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Hospital not found' });
      res.json({ message: 'Hospital updated' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM hospitals WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Hospital not found' });
    res.json({ message: 'Hospital deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;