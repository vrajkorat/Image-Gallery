const API_BASE = 'http://localhost:5000/api';

export async function apiFetch(path, opts = {}) {
  const token = localStorage.getItem('token');
  const headers = opts.headers || {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (!res.ok) {
    const err = await res.json().catch(()=>({msg:'Network error'}));
    throw err;
  }
  return res.json();
}