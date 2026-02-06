const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prepare } = require('../db/database');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // Check if user exists
    const existingUser = prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = prepare('INSERT INTO users (email, password) VALUES (?, ?)').run(email, hashedPassword);

    // Generate token
    const token = jwt.sign({ id: result.lastInsertRowid, email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'User created successfully', token, user: { id: result.lastInsertRowid, email } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user
    const user = prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Login successful', token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

module.exports = router;
