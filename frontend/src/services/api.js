const API_BASE = '/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Auth API
export const authAPI = {
  signup: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    return data;
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  }
};

// Todo API
export const todoAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/todos`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch todos');
    return data;
  },

  create: async (title) => {
    const res = await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create todo');
    return data;
  },

  update: async (id, updates) => {
    const res = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update todo');
    return data;
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete todo');
    return data;
  }
};
