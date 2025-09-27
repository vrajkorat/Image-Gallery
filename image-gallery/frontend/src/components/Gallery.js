import React, { useEffect, useState } from 'react';

export default function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/images/public')
      .then(r => r.json())
      .then(setImages)
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="gallery">
      {images.length === 0 ? <p>No approved images yet.</p> :
        images.map(img => (
          <div className="card" key={img._id}>
            <img src={`http://localhost:5000/uploads/${img.filename}`} alt={img.caption} />
            <div className="meta">
              <p><strong>{img.caption}</strong></p>
              <p>by: {img.uploaderName || img.uploaderEmail}</p>
            </div>
          </div>
        ))
      }
    </div>
  );
}