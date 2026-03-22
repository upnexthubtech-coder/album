import React from 'react';


const MediaList = ({ media, onEdit, onDelete, onReplace }) => {
  return (
    <div className="media-list">
      <h2>Media List</h2>
      <ul className="media-grid">
        {media.map((item) => (
          <li key={item._id} className="media-card">
            <div className="media-thumb">
              {item.type === 'image' ? (
                <img
                  src={`https://vinaknaikadventure-1.onrender.com/api/media/file/${item.fileId}`}
                  alt={item.title}
                />
              ) : (
                <video
                  controls
                  src={`https://vinaknaikadventure-1.onrender.com/api/media/file/${item.fileId}`}
                />
              )}
            </div>
            <div className="media-info">
              <strong>{item.title}</strong>
              <span className="media-type">{item.type}</span>
            </div>
            <div className="media-actions">
              <button className="edit-btn" onClick={() => onEdit(item)}>Edit</button>
              <button className="replace-btn" onClick={() => onReplace(item)}>Replace</button>
              <button className="delete-btn" onClick={() => onDelete(item._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MediaList;
