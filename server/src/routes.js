const express = require('express');
const { initDB } = require('./db');
const { hashPassword, comparePassword, generateToken, authenticateToken } = require('./auth');

const router = express.Router();

// Auth Routes
router.post('/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const db = await initDB();
    const hashedPassword = await hashPassword(password);
    const result = await db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    const user = { id: result.lastID, email };
    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await initDB();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD Routes (Protected)
router.get('/items', authenticateToken, async (req, res) => {
  try {
    const db = await initDB();
    const items = await db.all('SELECT * FROM items WHERE user_id = ?', [req.user.id]);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/items', authenticateToken, async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const db = await initDB();
    const result = await db.run(
      'INSERT INTO items (user_id, title, description) VALUES (?, ?, ?)',
      [req.user.id, title, description]
    );
    res.json({ id: result.lastID, title, description, created_at: new Date() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/items/:id', authenticateToken, async (req, res) => {
  const { title, description } = req.body;
  try {
    const db = await initDB();
    const result = await db.run(
      'UPDATE items SET title = ?, description = ? WHERE id = ? AND user_id = ?',
      [title, description, req.params.id, req.user.id]
    );
    if (result.changes === 0) return res.status(404).json({ error: 'Item not found or unauthorized' });
    res.json({ message: 'Updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/items/:id', authenticateToken, async (req, res) => {
  try {
    const db = await initDB();
    const result = await db.run(
      'DELETE FROM items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (result.changes === 0) return res.status(404).json({ error: 'Item not found or unauthorized' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
