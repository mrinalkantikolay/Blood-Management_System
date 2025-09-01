const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.signup = async (req, res) => {
    const { firstName: first_name, lastName: last_name, email, username, password } = req.body;
    try {
        console.log('Signup: Checking if username or email exists');
        const [results] = await db.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );
        console.log('Signup: Query result:', results);
        if (results.length > 0) {
            console.log('Signup: Username or email already exists');
            return res.status(400).json({
                error: 'Username or email already exists'
            });
        }

        console.log('Signup: Hashing password');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Signup: Password hashed');

        // Insert new user
        console.log('Signup: Inserting new user');
        const [insertResult] = await db.query(
            'INSERT INTO users (first_name, last_name, email, username, password) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, email, username, hashedPassword]
        );
        console.log('Signup: Insert result:', insertResult);

        const token = jwt.sign(
            { id: insertResult.insertId, username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Signup: User created successfully');
        res.status(201).json({
            message: 'User created successfully',
            token
        });
    } catch (error) {
        console.error('Signup: Server error:', error);
        res.status(500).json({ error: 'Server error occurred' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        console.log('User login route hit', req.body);
        const [results] = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        console.log('Database query results:', results);
        if (results.length === 0) {
            console.log('No user found with that username');
            return res.status(401).json({
                error: 'Invalid username or password'
            });
        }

        const user = results[0];
        console.log('User found, checking password');
        const validPassword = await bcrypt.compare(password, user.password);
        console.log('Password match result:', validPassword);

        if (!validPassword) {
            console.log('Password does not match');
            return res.status(401).json({
                error: 'Invalid username or password'
            });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Login successful, sending token');
        res.json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        console.error('Login: Server error:', error);
        res.status(500).json({ error: 'Server error occurred' });
    }
};
