import React, { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [pending, setPending] = useState([]);

  const fetchPending = () => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/images/pending', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(setPending)
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchPending(); }, []);

  const approve = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/images/${id}/approve`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
    fetchPending();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/images/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    fetchPending();
  };

  return (
    <div className="admin">
      <h2>Pending uploads</h2>
      {pending.length === 0 ? <p>No pending uploads.</p> :
        pending.map(img => (
          <div key={img._id} className="admin-card">
            <img src={`http://localhost:5000/uploads/${img.filename}`} alt={img.caption} />
            <div>
              <p><strong>{img.caption}</strong></p>
              <p>by: {img.uploaderName} ({img.uploaderEmail})</p>
              <button onClick={() => approve(img._id)}>Approve</button>
              <button onClick={() => remove(img._id)}>Delete</button>
            </div>
          </div>
        ))
      }
    </div>
  );
}