const express = require('express');
const { prepare } = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all todos for the authenticated user
router.get('/', (req, res) => {
  try {
    const todos = prepare('SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json(todos);
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ error: 'Failed to fetch todos.' });
  }
});

// Create a new todo
router.post('/', (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required.' });
    }

    const result = prepare('INSERT INTO todos (user_id, title) VALUES (?, ?)').run(req.user.id, title.trim());
    const newTodo = prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: 'Failed to create todo.' });
  }
});

// Update a todo
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    // Check if todo exists and belongs to user
    const todo = prepare('SELECT * FROM todos WHERE id = ? AND user_id = ?').get(parseInt(id), req.user.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found.' });
    }

    // Update fields
    const newTitle = title !== undefined ? title.trim() : todo.title;
    const newCompleted = completed !== undefined ? (completed ? 1 : 0) : todo.completed;

    prepare('UPDATE todos SET title = ?, completed = ? WHERE id = ?').run(newTitle, newCompleted, parseInt(id));
    const updatedTodo = prepare('SELECT * FROM todos WHERE id = ?').get(parseInt(id));

    res.json(updatedTodo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ error: 'Failed to update todo.' });
  }
});

// Delete a todo
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Check if todo exists and belongs to user
    const todo = prepare('SELECT * FROM todos WHERE id = ? AND user_id = ?').get(parseInt(id), req.user.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found.' });
    }

    prepare('DELETE FROM todos WHERE id = ?').run(parseInt(id));
    res.json({ message: 'Todo deleted successfully.' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Failed to delete todo.' });
  }
});

module.exports = router;
