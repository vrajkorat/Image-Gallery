import React, { useState, useEffect } from 'react';
import { apiFetch } from './api';
import UploadForm from './components/UploadForm';
import Gallery from './components/Gallery';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [view, setView] = useState('gallery');
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw data;
      localStorage.setItem('token', data.token);
      setUser(data.user);
      alert('Logged in');
      return true;
    } catch (err) { alert(err.msg || 'Login failed'); return false; }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw data;
      localStorage.setItem('token', data.token);
      setUser(data.user);
      alert('Registered & logged in');
      return true;
    } catch (err) { alert(err.msg || 'Register failed'); return false; }
  };

  return (
    <div className="container">
      <header>
        <h1>Image Gallery with Approval</h1>
        <nav>
          <button onClick={() => setView('gallery')}>Gallery</button>
          <button onClick={() => setView('upload')}>Upload</button>
          {user && user.role === 'admin' && <button onClick={() => setView('admin')}>Admin</button>}
        </nav>
        <div className="auth">
          {user ? (
            <>
              <span>Hi, {user.name} ({user.role})</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <AuthBox onLogin={login} onRegister={register} />
          )}
        </div>
      </header>

      <main>
        {view === 'gallery' && <Gallery />}
        {view === 'upload' && <UploadForm onUploaded={() => setView('gallery')} />}
        {view === 'admin' && user && user.role === 'admin' && <AdminDashboard />}
      </main>
    </div>
  );
}

function AuthBox({ onLogin, onRegister }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (mode === 'login') await onLogin(email, password);
    else await onRegister(name, email, password);
  };

  return (
    <div className="auth-box">
      <form onSubmit={submit}>
        {mode === 'register' && <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />}
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? 'Create account' : 'Have an account? Login'}
      </button>
    </div>
  );
}

export default App;