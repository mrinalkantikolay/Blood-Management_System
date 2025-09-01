
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');
const { signup, login } = require('../controllers/authController');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Auth routes
router.post('/signup', signup);
router.post('/login', login);

// Admin: Get all donations with user info
router.get('/admin/donations', authenticateToken, (req, res) => {
  (async () => {
    try {
      const [results] = await db.query(`SELECT d.*, u.first_name, u.last_name FROM donors d LEFT JOIN users u ON d.user_id = u.id`);
      res.json(results);
    } catch (err) {
      return res.status(500).json({ error: 'Database error' });
    }
  })();
});

// Admin: Get all blood requests with user info
router.get('/admin/requests', authenticateToken, (req, res) => {
  (async () => {
    try {
      const [results] = await db.query(`SELECT br.*, u.first_name, u.last_name FROM blood_requests br LEFT JOIN users u ON br.user_id = u.id`);
      res.json(results);
    } catch (err) {
      return res.status(500).json({ error: 'Database error' });
    }
  })();
});

// Admin: Get analytics summary
router.get('/admin/analytics', authenticateToken, (req, res) => {
  (async () => {
    try {
      const [donors] = await db.query('SELECT COUNT(*) AS total_donors FROM donors');
      const [requests] = await db.query('SELECT COUNT(*) AS total_requests FROM blood_requests');
      const [stock] = await db.query('SELECT SUM(quantity) AS total_stock FROM blood_stock');
      const stats = {
        total_donors: donors[0].total_donors,
        total_requests: requests[0].total_requests,
        total_stock: stock[0].total_stock || 0
      };
      res.json(stats);
    } catch (err) {
      return res.status(500).json({ error: 'Database error' });
    }
  })();
});

// Get user profile (protected route)
router.get('/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;
  (async () => {
    try {
      const [results] = await db.query('SELECT id, first_name, last_name, email, username FROM users WHERE id = ?', [userId]);
      if (results.length === 0) return res.status(404).json({ error: 'User not found' });
      res.json(results[0]);
    } catch (err) {
      return res.status(500).json({ error: 'Database error' });
    }
  })();
});

// Update user profile (protected route)
router.put('/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { first_name, last_name, email } = req.body;
  (async () => {
    try {
      await db.query('UPDATE users SET first_name=?, last_name=?, email=? WHERE id=?', [first_name, last_name, email, userId]);
      res.json({ message: 'Profile updated' });
    } catch (err) {
      return res.status(500).json({ error: 'Database error' });
    }
  })();
});

// Get user donation/request history (protected route)
router.get('/history', authenticateToken, (req, res) => {
  const userId = req.user.id;
  (async () => {
    try {
      // Find donor id for this user
      const [donorRows] = await db.query('SELECT id FROM donors WHERE user_id = ?', [userId]);
      let donations = [];
      if (donorRows.length > 0) {
        const donorId = donorRows[0].id;
        // Get all donations for this donor
        const [donationRows] = await db.query(`
          SELECT d.*, h.name AS hospital
          FROM donations d
          LEFT JOIN hospitals h ON d.hospital_id = h.id
          WHERE d.donor_id = ?
          ORDER BY d.donation_date DESC
        `, [donorId]);
        donations = donationRows;
      }
      const [requests] = await db.query('SELECT * FROM blood_requests WHERE user_id = ?', [userId]);
      res.json({ donations, requests });
    } catch (err) {
      return res.status(500).json({ error: 'Database error' });
    }
  })();
});


// Get all users (protected route)
router.get('/', authenticateToken, (req, res) => {
  (async () => {
    try {
      const [results] = await db.query('SELECT * FROM users');
      res.json(results);
    } catch (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
  })();
});

// Get a single user by ID (protected route)
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  (async () => {
    try {
      const [results] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(results[0]);
    } catch (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
  })();
});

// Create a new user (public route — can protect if needed)
router.post('/', (req, res) => {
  const { first_name, last_name, email, username, password } = req.body;
  if (!first_name || !last_name || !email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  (async () => {
    try {
      const [result] = await db.query(
        'INSERT INTO users (first_name, last_name, email, username, password) VALUES (?, ?, ?, ?, ?)',
        [first_name, last_name, email, username, password]
      );
      res.status(201).json({ id: result.insertId, first_name, last_name, email, username });
    } catch (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ error: 'Database insert error' });
    }
  })();
});

// Create a new user via /api/users/signup (public route)
router.post('/signup', (req, res) => {
  const { first_name, last_name, email, username, password } = req.body;
  if (!first_name || !last_name || !email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  (async () => {
    try {
      const [result] = await db.query(
        'INSERT INTO users (first_name, last_name, email, username, password) VALUES (?, ?, ?, ?, ?)',
        [first_name, last_name, email, username, password]
      );
      res.status(201).json({ id: result.insertId, first_name, last_name, email, username });
    } catch (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ error: 'Database insert error' });
    }
  })();
});

// User login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  (async () => {
    try {
      const [results] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
      if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
      const user = results[0];
      // For demo: compare plain text (should hash in production)
      if (user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
      // Create JWT token
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (err) {
      return res.status(500).json({ error: 'Database error' });
    }
  })();
});

// Update a user (protected route)
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  (async () => {
    try {
      const [result] = await db.query(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User updated successfully' });
    } catch (err) {
      console.error('Database update error:', err);
      return res.status(500).json({ error: 'Database update error' });
    }
  })();
});

// Delete a user (protected route)
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  (async () => {
    try {
      const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error('Database delete error:', err);
      return res.status(500).json({ error: 'Database delete error' });
    }
  })();
});

module.exports = router;