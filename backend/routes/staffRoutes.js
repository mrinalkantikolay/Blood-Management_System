
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Staff password reset endpoint (admin or self-service)
router.post('/reset-password', async (req, res) => {
  const { email, username, newPassword } = req.body;
  if ((!email && !username) || !newPassword) {
    return res.status(400).json({ error: 'Email or username and newPassword are required' });
  }
  const identifier = email ? { field: 'email', value: email } : { field: 'username', value: username };
  try {
    const [results] = await db.query(`SELECT * FROM staff WHERE ${identifier.field} = ?`, [identifier.value]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await db.query(`UPDATE staff SET password = ? WHERE ${identifier.field} = ?`, [hash, identifier.value]);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// Staff login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  try {
    console.log('Staff login: Querying staff by username or email:', username);
    const [results] = await db.query('SELECT * FROM staff WHERE username = ? OR email = ?', [username, username]);
    console.log('Staff login: Query results:', results);
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }
    const staff = results[0];
    const valid = await bcrypt.compare(password, staff.password);
    console.log('Staff login: Password match result:', valid);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }
    // Set is_active to TRUE on login
    await db.query('UPDATE staff SET is_active = TRUE WHERE id = ?', [staff.id]);
    // Generate JWT
    const token = jwt.sign({ id: staff.id, username: staff.username, role: 'staff' }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (error) {
    console.error('Staff login: Server error:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
});
// Staff logout route: set is_active to FALSE
router.post('/logout', async (req, res) => {
  const { staffId } = req.body;
  if (!staffId) {
    return res.status(400).json({ error: 'staffId is required' });
  }
  try {
    await db.query('UPDATE staff SET is_active = FALSE WHERE id = ?', [staffId]);
    res.json({ message: 'Staff logged out and status updated.' });
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});


// Get all staff (for admin dashboard)
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM staff');
    // Map DB fields to camelCase for frontend
    const mapped = results.map(staff => ({
      id: staff.id,
      firstName: staff.first_name,
      lastName: staff.last_name,
      email: staff.email,
      phone: staff.phone,
      isActive: !!staff.is_active,
      createdAt: staff.created_at
    }));
    res.json(mapped);
  } catch (err) {
    console.error('Error fetching staff:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add a new staff member
// Update a staff member by id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const first_name = req.body.first_name || req.body.firstName;
  const last_name = req.body.last_name || req.body.lastName;
  const email = req.body.email;
  const phone = req.body.phone;
  if (!first_name || !last_name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const [result] = await db.query(
      'UPDATE staff SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?',
      [first_name, last_name, email, phone, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    res.json({ message: 'Staff updated successfully' });
  } catch (err) {
    console.error('Error updating staff:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add a new staff member (accept both camelCase and snake_case)
router.post('/', async (req, res) => {
  const first_name = req.body.first_name || req.body.firstName;
  const last_name = req.body.last_name || req.body.lastName;
  const email = req.body.email;
  const phone = req.body.phone;
  if (!first_name || !last_name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO staff (first_name, last_name, email, phone, username, password) VALUES (?, ?, ?, ?, NULL, NULL)',
      [first_name, last_name, email, phone]
    );
    res.json({ message: 'Staff added successfully', staffId: result.insertId });
  } catch (err) {
    console.error('Error adding staff:', err);
    res.status(500).json({ error: 'Database error' });
  }
});
// Delete a staff member by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM staff WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    res.json({ message: 'Staff deleted successfully' });
  } catch (err) {
    console.error('Error deleting staff:', err);
    res.status(500).json({ error: 'Database error' });
  }
});
// Check if email exists for staff registration
router.post('/check-email', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const [results] = await db.query('SELECT id, first_name, last_name, email, username, password FROM staff WHERE email = ?', [email]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Email not found. Please contact admin to get authorized.' });
    }
    const staff = results[0];
    // Check if already registered
    if (staff.username && staff.password) {
      return res.status(409).json({ error: 'Profile already exists. Please use login instead.' });
    }
    // Return basic info for registration form
    res.json({ 
      found: true, 
      first_name: staff.first_name, 
      last_name: staff.last_name,
      email: staff.email,
      message: `Welcome ${staff.first_name} ${staff.last_name}! Please complete your registration.`
    });
  } catch (err) {
    console.error('Error in staff self-register:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Staff self-register endpoint
router.post('/self-register', async (req, res) => {
  const { email, username, password, phone } = req.body;
  console.log('[Self-Register] Received:', { email, username, phone });
  if (!email || !username || !password || !phone) {
    console.log('[Self-Register] Missing required fields');
    return res.status(400).json({ error: 'Missing required fields: email, username, password, and phone are required' });
  }
  try {
    console.log('[Self-Register] Querying staff by email:', email);
    const [results] = await db.query('SELECT * FROM staff WHERE email = ?', [email]);
    console.log('[Self-Register] Query result:', results);
    if (results.length === 0) {
      console.log('[Self-Register] Email not found');
      return res.status(404).json({ error: 'Email not found. Please contact admin.' });
    }
    const staff = results[0];
    if (staff.username || staff.password) {
      console.log('[Self-Register] Profile already created for this email');
      return res.status(409).json({ error: 'Profile already created for this email.' });
    }
    // Hash password
    console.log('[Self-Register] Hashing password');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('[Self-Register] Updating staff record');
    const [updateResult] = await db.query('UPDATE staff SET username = ?, password = ?, phone = ? WHERE email = ?', [username, hashedPassword, phone, email]);
    console.log('[Self-Register] Update result:', updateResult);
    res.status(201).json({ message: 'Staff registered successfully', staffId: staff.id });
  } catch (err) {
    console.error('Error in staff self-register:', err);
    res.status(500).json({ error: 'Database error' });
  }
});
// (Removed duplicate non-async staff add route. Use the async/await version above.)
const { authenticateToken } = require('../middleware/auth');

// Get all donations (for staff dashboard)
// Update a donation by id
router.put('/donations/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { quantity, donation_date } = req.body;
  if (!quantity || !donation_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  let formattedDate = donation_date;
  if (donation_date && donation_date.includes('T')) {
    formattedDate = new Date(donation_date).toISOString().slice(0, 10);
  }
  try {
    const [result] = await db.query(
      'UPDATE donations SET quantity = ?, donation_date = ? WHERE id = ?',
      [quantity, formattedDate, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    res.json({ message: 'Donation updated successfully' });
  } catch (err) {
    console.error('Error updating donation:', err);
    return res.status(500).json({ error: 'Database error' });
  }
});

// Delete a donation by id
router.delete('/donations/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM donations WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    res.json({ message: 'Donation deleted successfully' });
  } catch (err) {
    console.error('Error deleting donation:', err);
    return res.status(500).json({ error: 'Database error' });
  }
});
router.get('/donations', authenticateToken, (req, res) => {
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

// Get all blood requests (for staff dashboard)
router.get('/requests', authenticateToken, (req, res) => {
  const sql = `
    SELECT br.id, br.quantity, br.request_date, br.status,
           p.name AS patient_name, p.blood_group AS patient_blood_group, p.age AS patient_age, p.contact AS patient_contact, p.address AS patient_address
    FROM blood_requests br
    JOIN patients p ON br.patient_id = p.id
    ORDER BY br.request_date DESC
  `;
  (async () => {
    try {
      const [results] = await db.query(sql);
      res.json(results);
    } catch (err) {
      console.error('Error fetching blood requests:', err);
      return res.status(500).json({ error: 'Database error' });
    }
  })();
});

module.exports = router;

// Update a blood request
router.put('/blood-requests/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { quantity, status } = req.body;
  const fields = [];
  const values = [];
  if (quantity !== undefined) {
    fields.push('quantity = ?');
    values.push(quantity);
  }
  if (status !== undefined) {
    fields.push('status = ?');
    values.push(status);
  }
  if (fields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  const sql = `UPDATE blood_requests SET ${fields.join(', ')} WHERE id = ?`;
  values.push(id);
  try {
    const [result] = await db.query(sql, values);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request updated successfully' });
  } catch (err) {
    console.error('DB error in blood-requests update:', err);
    return res.status(500).json({ error: 'Database error', details: err });
  }
});

// Delete a blood request
router.delete('/blood-requests/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM blood_requests WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});
