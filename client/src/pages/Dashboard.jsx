import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/items');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/items', { title, description });
      setItems([...items, res.data]);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/items/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="nav">
        <h2>Welcome, {user.email}</h2>
        <button className="secondary" onClick={logout}>Logout</button>
      </div>

      <div className="container">
        <h3>Add New Item</h3>
        <form onSubmit={handleCreate}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Create</button>
        </form>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Your Items</h3>
        {items.length === 0 ? <p>No items found.</p> : (
          items.map(item => (
            <div key={item.id} className="item-card">
              <div>
                <strong>{item.title}</strong>
                <p style={{ margin: '0.5rem 0', color: '#666' }}>{item.description}</p>
              </div>
              <button className="danger" onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
