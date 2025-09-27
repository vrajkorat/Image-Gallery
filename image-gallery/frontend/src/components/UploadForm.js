import React, { useState } from 'react';
import { apiFetch } from '../api';

export default function UploadForm({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Select an image');
    const fd = new FormData();
    fd.append('image', file);
    fd.append('caption', caption);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/images/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (!res.ok) throw data;
      alert('Uploaded — waiting for admin approval');
      setFile(null); setCaption('');
      if (onUploaded) onUploaded();
    } catch (err) {
      alert(err.msg || err.error || 'Upload failed');
    }
  };

  return (
    <form onSubmit={submit} className="upload-form">
      <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
      <input placeholder="Caption (optional)" value={caption} onChange={e => setCaption(e.target.value)} />
      <button type="submit">Upload</button>
    </form>
  );
}