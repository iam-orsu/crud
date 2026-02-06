import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { todoAPI } from '../services/api';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await todoAPI.getAll();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const todo = await todoAPI.create(newTodo);
      setTodos([todo, ...todos]);
      setNewTodo('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      const updated = await todoAPI.update(todo.id, { completed: !todo.completed });
      setTodos(todos.map(t => t.id === todo.id ? updated : t));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStartEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);
  };

  const handleSaveEdit = async (id) => {
    if (!editText.trim()) return;

    try {
      const updated = await todoAPI.update(id, { title: editText });
      setTodos(todos.map(t => t.id === id ? updated : t));
      setEditingId(null);
      setEditText('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await todoAPI.delete(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = todos.length - completedCount;

  return (
    <div className="todo-container">
      <div className="todo-wrapper">
        <header className="todo-header">
          <h1 className="todo-title">My Todos</h1>
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
            <button onClick={handleLogout} className="btn btn-secondary btn-logout">
              Logout
            </button>
          </div>
        </header>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleAddTodo} className="add-todo-form">
          <input
            type="text"
            className="add-todo-input"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-add">
            Add
          </button>
        </form>

        {todos.length > 0 && (
          <div className="todo-stats">
            <div className="stat-item">
              <span className="stat-value">{todos.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{pendingCount}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{completedCount}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading todos...</div>
        ) : todos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p className="empty-text">No todos yet. Add one above!</p>
          </div>
        ) : (
          <div className="todo-list">
            {todos.map(todo => (
              <div key={todo.id} className="todo-item">
                <div
                  className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
                  onClick={() => handleToggleComplete(todo)}
                />
                <div className="todo-content">
                  {editingId === todo.id ? (
                    <input
                      type="text"
                      className="todo-edit-input"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(todo.id)}
                      autoFocus
                    />
                  ) : (
                    <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                      {todo.title}
                    </span>
                  )}
                </div>
                <div className="todo-actions">
                  {editingId === todo.id ? (
                    <button
                      className="btn-icon btn-save"
                      onClick={() => handleSaveEdit(todo.id)}
                      title="Save"
                    >
                      ✓
                    </button>
                  ) : (
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => handleStartEdit(todo)}
                      title="Edit"
                    >
                      ✎
                    </button>
                  )}
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => handleDelete(todo.id)}
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
