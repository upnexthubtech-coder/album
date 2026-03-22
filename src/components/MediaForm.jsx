import React, { useState } from 'react';

const MediaForm = ({ onSubmit, initialData, isEdit }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [type, setType] = useState(initialData?.type || 'image');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || (!file && !isEdit)) return;
    onSubmit({ title, type, file });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
      </div>
      {!isEdit && (
        <div>
          <label>File:</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>
      )}
      <button type="submit">{isEdit ? 'Update' : 'Upload'}</button>
    </form>
  );
};

export default MediaForm;
