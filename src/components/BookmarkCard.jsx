import { ExternalLink, Tag, Trash2, Edit2 } from 'lucide-react';

export default function BookmarkCard({ bookmark, onDelete, onEdit, onTagClick, viewMode = 'grid' }) {
  const { id, title, url, note, tags, createdAt } = bookmark;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (viewMode === 'list') {
    return (
      <div className="card glass-panel animate-fade-in list-item-card">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
          {bookmark.imageUrl && (
            <div style={{ flexShrink: 0, width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <img src={bookmark.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: '1.05rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)' }}>
                {title || url}
              </a>
            </h3>
            {note && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {note}
              </p>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', overflowX: 'auto', paddingBottom: '0.2rem' }} className="hide-scroll">
               {tags && tags.map((tag, idx) => (
                 <span key={idx} className="tag clickable" onClick={() => onTagClick(tag)} style={{ padding: '0.1rem 0.5rem', fontSize: '0.7rem' }}>
                   #{tag}
                 </span>
               ))}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginRight: '0.5rem', whiteSpace: 'nowrap' }} className="mobile-hidden">
            {formatDate(createdAt)}
          </div>
          <button className="btn-icon" onClick={() => onEdit(bookmark)} aria-label="Edytuj" title="Edytuj">
            <Edit2 size={16} />
          </button>
          <button className="btn-icon danger" onClick={() => onDelete(id)} aria-label="Usuń" title="Usuń">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  }

  // WIDOK GRID (Domyślny)
  return (
    <div className="card glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
      {bookmark.imageUrl && (
        <div style={{ width: '100%', height: '140px', backgroundColor: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--glass-border)' }}>
          <img src={bookmark.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0, paddingRight: '1rem', flex: 1, wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {title || url}
          </h3>
          <div style={{ display: 'flex', gap: '0.2rem' }}>
            <button className="btn-icon" onClick={() => onEdit(bookmark)} aria-label="Edytuj" title="Edytuj">
              <Edit2 size={16} />
            </button>
            <button className="btn-icon danger" onClick={() => onDelete(id)} aria-label="Usuń" title="Usuń">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}
          >
            <span>Odwiedź stronę</span>
            <ExternalLink size={14} />
          </a>
        </div>

        {note && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
            {note}
          </p>
        )}

        <div style={{ flex: 1 }}></div>

        {tags && tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="tag clickable"
                onClick={() => onTagClick(tag)}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', textAlign: 'right' }}>
          Dodano: {formatDate(createdAt)}
        </div>
      </div>
    </div>
  );
}
