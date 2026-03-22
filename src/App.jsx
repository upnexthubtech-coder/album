import React, { useEffect, useState } from 'react';

const API_URL = 'https://vinaknaikadventure-1.onrender.com/api/media';

const T = {
  bg: '#0d0f0e',
  surface: '#161a18',
  card: '#1c221f',
  border: '#2a342e',
  accent: '#e8a045',
  accentHover: '#f0b55a',
  danger: '#e05252',
  success: '#4caf81',
  white: '#f7f7f5',
  text: '#d7ddd9',
  textDim: '#a6b0aa',
  muted: '#7d8b83',
};

const GlobalStyle = () => (
  <style>{`
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'DM Sans', sans-serif;
      background: ${T.bg};
      color: ${T.text};
    }
    button, input, select, textarea {
      font: inherit;
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .card-hover:hover .card-overlay {
      opacity: 1 !important;
    }
  `}</style>
);

const PwaInstallPrompt = () => {
  const [showInstall, setShowInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const alreadyInstalled =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (alreadyInstalled) return;

    const beforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', beforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstall(false);
    }
  };

  if (!showInstall) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 18px 50px rgba(0,0,0,0.45)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 8 }}>📱</div>
        <h3 style={{ margin: '0 0 10px', color: T.white }}>Install Adventure Media Album</h3>
        <p style={{ margin: '0 0 18px', color: T.textDim, lineHeight: 1.6 }}>
          Get quick access from your home screen. Install the app?
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
          <button
            onClick={handleInstallClick}
            style={{
              background: T.accent,
              color: '#1a0f00',
              border: 'none',
              borderRadius: 10,
              padding: '12px 18px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Install
          </button>
          <button
            onClick={() => setShowInstall(false)}
            style={{
              background: 'transparent',
              color: T.text,
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              padding: '12px 18px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
};

const MediaForm = ({ onSubmit, initialData, isEdit, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [type, setType] = useState(initialData?.type || 'image');
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || (!file && !isEdit)) return;
    onSubmit({ title, type, file });
  };

  const formWrap = {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 16,
    padding: '32px 36px',
    marginBottom: 40,
    animation: 'fadeUp 0.4s ease both',
    boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
  };

  const label = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: T.muted,
    marginBottom: 8,
  };

  const input = {
    width: '100%',
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 10,
    color: T.white,
    fontSize: 15,
    padding: '12px 16px',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.2s',
  };

  const dropZone = {
    border: `2px dashed ${dragging ? T.accent : T.border}`,
    borderRadius: 10,
    padding: '24px 16px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: dragging ? 'rgba(232,160,69,0.06)' : T.card,
  };

  return (
    <div style={formWrap}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 28,
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22,
            color: T.white,
            fontWeight: 700,
            margin: 0,
          }}
        >
          {isEdit ? '✏️ Edit Media' : '+ Upload Adventure'}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              color: T.muted,
              cursor: 'pointer',
              fontSize: 22,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 160px',
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <label style={label}>Title</label>
            <input
              style={input}
              type="text"
              placeholder="Name your adventure..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              onFocus={(e) => (e.target.style.borderColor = T.accent)}
              onBlur={(e) => (e.target.style.borderColor = T.border)}
            />
          </div>
          <div>
            <label style={label}>Type</label>
            <select
              style={{ ...input, cursor: 'pointer' }}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="image">🖼 Image</option>
              <option value="video">🎬 Video</option>
            </select>
          </div>
        </div>

        {!isEdit && (
          <div style={{ marginBottom: 24 }}>
            <label style={label}>File</label>
            <div
              style={dropZone}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
              }}
            >
              {file ? (
                <div style={{ color: T.accent, fontWeight: 500 }}>
                  📎 {file.name}
                  <span style={{ color: T.muted, marginLeft: 8, fontSize: 12 }}>
                    ({(file.size / 1024 / 1024).toFixed(1)} MB)
                  </span>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>☁️</div>
                  <div style={{ color: T.textDim, fontSize: 13 }}>
                    Drag & drop or{' '}
                    <label
                      style={{
                        color: T.accent,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      browse
                      <input
                        type="file"
                        accept="image/*,video/*"
                        style={{ display: 'none' }}
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                      />
                    </label>
                  </div>
                  <div style={{ color: T.muted, fontSize: 11, marginTop: 4 }}>
                    Images & videos supported
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          style={{
            background: T.accent,
            color: '#1a0f00',
            border: 'none',
            borderRadius: 10,
            padding: '13px 28px',
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = T.accentHover;
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = T.accent;
            e.target.style.transform = 'none';
          }}
        >
          {isEdit ? 'Save Changes' : 'Upload Media'}
        </button>
      </form>
    </div>
  );
};

const MediaCard = ({ item, onEdit, onDelete, onReplace, index }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileUrl = `https://vinaknaikadventure-1.onrender.com/api/media/file/${item.fileId}`;

  const card = {
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 14,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    animation: `fadeUp 0.4s ${index * 0.05}s cubic-bezier(.22,.68,0,1.2) both`,
    transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
    position: 'relative',
  };

  const thumb = {
    width: '100%',
    aspectRatio: '4/3',
    objectFit: 'cover',
    display: 'block',
  };

  const typeBadge = {
    position: 'absolute',
    top: 10,
    left: 10,
    background:
      item.type === 'video'
        ? 'rgba(232,160,69,0.85)'
        : 'rgba(76,175,129,0.85)',
    color: '#fff',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '3px 9px',
    borderRadius: 20,
    backdropFilter: 'blur(6px)',
    zIndex: 2,
  };

  const overlay = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: 1,
  };

  const btnBase = {
    flex: 1,
    border: 'none',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    padding: '8px 6px',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.18s ease',
    letterSpacing: '0.02em',
  };

  return (
    <div
      className="card-hover"
      style={card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.5)';
        e.currentTarget.style.borderColor = '#3a4a40';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = T.border;
      }}
    >
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={typeBadge}>{item.type === 'video' ? '▶ Video' : '⬛ Photo'}</div>
        <div className="card-overlay" style={overlay} />
        {item.type === 'image' ? (
          <img src={fileUrl} alt={item.title} style={thumb} loading="lazy" />
        ) : (
          <video
            src={fileUrl}
            style={thumb}
            muted
            playsInline
            onMouseEnter={(e) => e.target.play()}
            onMouseLeave={(e) => {
              e.target.pause();
              e.target.currentTime = 0;
            }}
          />
        )}
      </div>

      <div style={{ padding: '12px 14px 8px', borderTop: `1px solid ${T.border}` }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 14,
            color: T.white,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.title}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, padding: '8px 14px 12px' }}>
        {confirmDelete ? (
          <>
            <button
              style={{ ...btnBase, background: T.danger, color: '#fff' }}
              onClick={() => onDelete(item._id)}
            >
              Confirm
            </button>
            <button
              style={{ ...btnBase, background: T.border, color: T.text }}
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              style={{ ...btnBase, background: 'rgba(232,160,69,0.15)', color: T.accent }}
              onClick={() => onEdit(item)}
            >
              Edit
            </button>
            <button
              style={{ ...btnBase, background: 'rgba(76,175,129,0.15)', color: T.success }}
              onClick={() => onReplace(item)}
            >
              Replace
            </button>
            <button
              style={{ ...btnBase, background: 'rgba(224,82,82,0.15)', color: T.danger }}
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const MediaList = ({ media, onEdit, onDelete, onReplace }) => {
  if (!media.length) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: T.muted }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏔️</div>
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 24,
            color: T.textDim,
            marginBottom: 8,
          }}
        >
          No adventures yet
        </div>
        <div style={{ fontSize: 14 }}>Upload your first photo or video above</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22,
            color: T.white,
            fontWeight: 700,
            margin: 0,
          }}
        >
          Gallery
        </h2>
        <span
          style={{
            background: T.border,
            color: T.muted,
            borderRadius: 20,
            padding: '2px 10px',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {media.length} items
        </span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 18,
        }}
      >
        {media.map((item, i) => (
          <MediaCard
            key={item._id}
            item={item}
            index={i}
            onEdit={onEdit}
            onDelete={onDelete}
            onReplace={onReplace}
          />
        ))}
      </div>
    </div>
  );
};

const Spinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
    <div
      style={{
        width: 40,
        height: 40,
        border: `3px solid ${T.border}`,
        borderTop: `3px solid ${T.accent}`,
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }}
    />
  </div>
);

export default function App() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [replacing, setReplacing] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const fetchMedia = async (pageNum = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}?limit=20&page=${pageNum}`);
      const data = await res.json();
      if (data.success) {
        setMedia(data.data || []);
        setPagination(
          data.pagination || {
            page: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          }
        );
      } else {
        setError(data.error || 'Failed to fetch media');
      }
    } catch {
      setError('Failed to fetch media');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia(page);
  }, [page]);

  const handleAdd = async ({ title, type, file }) => {
    setError('');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);
    formData.append('file', file);

    try {
      const res = await fetch(API_URL, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setPage(1);
        fetchMedia(1);
        setShowUpload(false);
      } else {
        setError(data.error || 'Failed to upload');
      }
    } catch {
      setError('Failed to upload');
    }
  };

  const handleUpdate = async ({ title, type }) => {
    setError('');
    try {
      const res = await fetch(`${API_URL}/${editing._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type }),
      });
      const data = await res.json();
      if (data.success) {
        setEditing(null);
        fetchMedia(page);
      } else {
        setError(data.error || 'Failed to update');
      }
    } catch {
      setError('Failed to update');
    }
  };

  const handleReplaceFile = async ({ title, type, file }) => {
    setError('');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);
    formData.append('file', file);

    try {
      await fetch(`${API_URL}/${replacing._id}`, { method: 'DELETE' });
      const res = await fetch(API_URL, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setReplacing(null);
        fetchMedia(page);
      } else {
        setError(data.error || 'Failed to replace');
      }
    } catch {
      setError('Failed to replace');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchMedia(page);
      } else {
        setError(data.error || 'Failed to delete');
      }
    } catch {
      setError('Failed to delete');
    }
  };

  const wrap = {
    minHeight: '100vh',
    background: T.bg,
    paddingBottom: 60,
  };

  const header = {
    background: `linear-gradient(180deg, #0b1410 0%, ${T.bg} 100%)`,
    borderBottom: `1px solid ${T.border}`,
    marginBottom: 40,
    position: 'relative',
    overflow: 'hidden',
  };

  const heroText = {
    maxWidth: 860,
    margin: '0 auto',
    padding: '52px 24px 40px',
    position: 'relative',
    zIndex: 1,
  };

  const container = {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '0 24px',
  };

  const uploadBtn = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: T.accent,
    color: '#1a0f00',
    border: 'none',
    borderRadius: 10,
    padding: '12px 24px',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.2s',
    letterSpacing: '0.03em',
  };

  const paginationBar = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 48,
  };

  const pageBtn = (disabled) => ({
    background: disabled ? T.card : T.surface,
    border: `1px solid ${T.border}`,
    color: disabled ? T.muted : T.text,
    borderRadius: 10,
    padding: '10px 20px',
    fontWeight: 600,
    fontSize: 13,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.2s',
    opacity: disabled ? 0.5 : 1,
  });

  return (
    <div style={wrap}>
      <GlobalStyle />
      <PwaInstallPrompt />

      <div style={header}>
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,160,69,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -40,
            left: -60,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(76,175,129,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={heroText}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: T.accent,
                  marginBottom: 10,
                }}
              >
                ⛰️ Adventure Chronicles
              </div>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(32px, 5vw, 52px)',
                  fontWeight: 900,
                  color: T.white,
                  lineHeight: 1.1,
                  marginBottom: 12,
                  marginTop: 0,
                }}
              >
                Your Adventure
                <br />
                <span style={{ color: T.accent }}>Media Album</span>
              </h1>
              <p style={{ color: T.textDim, fontSize: 15, maxWidth: 480, lineHeight: 1.6, margin: 0 }}>
                Capture, curate, and relive every trail, summit, and wild moment.
              </p>
            </div>
            <button
              style={uploadBtn}
              onClick={() => {
                setShowUpload((v) => !v);
                setEditing(null);
                setReplacing(null);
              }}
              onMouseEnter={(e) => {
                e.target.style.background = T.accentHover;
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 24px rgba(232,160,69,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = T.accent;
                e.target.style.transform = 'none';
                e.target.style.boxShadow = 'none';
              }}
            >
              {showUpload ? '✕ Close' : '+ Upload'}
            </button>
          </div>
        </div>
      </div>

      <div style={container}>
        {error && (
          <div
            style={{
              background: 'rgba(224,82,82,0.12)',
              border: `1px solid ${T.danger}`,
              color: T.danger,
              borderRadius: 10,
              padding: '12px 18px',
              marginBottom: 24,
              fontSize: 14,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              animation: 'fadeUp 0.3s ease both',
            }}
          >
            <span>⚠️ {error}</span>
            <button
              onClick={() => setError('')}
              style={{
                background: 'none',
                border: 'none',
                color: T.danger,
                cursor: 'pointer',
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        )}

        {showUpload && !editing && !replacing && (
          <MediaForm onSubmit={handleAdd} onCancel={() => setShowUpload(false)} />
        )}
        {editing && (
          <MediaForm
            onSubmit={handleUpdate}
            initialData={editing}
            isEdit
            onCancel={() => setEditing(null)}
          />
        )}
        {replacing && (
          <MediaForm
            onSubmit={handleReplaceFile}
            initialData={replacing}
            onCancel={() => setReplacing(null)}
          />
        )}

        {loading ? (
          <Spinner />
        ) : (
          <MediaList
            media={media}
            onEdit={(item) => {
              setEditing(item);
              setReplacing(null);
              setShowUpload(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDelete={handleDelete}
            onReplace={(item) => {
              setReplacing(item);
              setEditing(null);
              setShowUpload(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {!loading && media.length > 0 && (
          <div style={paginationBar}>
            <button
              style={pageBtn(!pagination.hasPrev)}
              disabled={!pagination.hasPrev}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              onMouseEnter={(e) => {
                if (pagination.hasPrev) e.target.style.borderColor = T.accent;
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = T.border;
              }}
            >
              ← Prev
            </button>

            <span style={{ fontSize: 13, color: T.muted, fontWeight: 500, padding: '0 4px' }}>
              Page <strong style={{ color: T.white }}>{pagination.page}</strong> of{' '}
              <strong style={{ color: T.white }}>{pagination.totalPages}</strong>
            </span>

            <button
              style={pageBtn(!pagination.hasNext)}
              disabled={!pagination.hasNext}
              onClick={() => setPage((p) => p + 1)}
              onMouseEnter={(e) => {
                if (pagination.hasNext) e.target.style.borderColor = T.accent;
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = T.border;
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
