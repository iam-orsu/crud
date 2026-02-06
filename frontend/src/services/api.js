const API_BASE = '/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper to handle responses
const handleResponse = async (res) => {
  const text = await res.text();
  
  // Try to parse as JSON
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error('Server returned invalid response');
  }
  
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  
  return data;
};

// Auth API
export const authAPI = {
  signup: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  }
};

// Todo API
export const todoAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/todos`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  create: async (title) => {
    const res = await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title })
    });
    return handleResponse(res);
  },

  update: async (id, updates) => {
    const res = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(res);
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};
