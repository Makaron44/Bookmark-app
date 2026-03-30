import { useState, useEffect } from 'react';
import { X, Wand2, Loader2 } from 'lucide-react';

export default function BookmarkModal({ onClose, onSave, initialData = null }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      setUrl(initialData.url || '');
      setTitle(initialData.title || '');
      setNote(initialData.note || '');
      setTagsInput(initialData.tags ? initialData.tags.join(', ') : '');
      setImageUrl(initialData.imageUrl || '');
    }
  }, [initialData]);

  const fetchTitle = async () => {
    if (!url) return;
    setIsFetching(true);
    try {
      // Pobieranie tytułu i miniatury za pomocą Microlink API
      const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      if (data.status === 'success') {
        if (data.data.title) setTitle(data.data.title);
        // Pobierz adres URL obrazka (OpenGraph / ikony)
        if (data.data.image && data.data.image.url) setImageUrl(data.data.image.url);
        else if (data.data.logo && data.data.logo.url) setImageUrl(data.data.logo.url);
      }
    } catch (e) {
      console.error('Błąd pobierania danych z API', e);
      alert('Nie udało się zaczytać danych. Uzupełnij ręcznie pole tytułu.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url) return;

    const tags = tagsInput
      .split(/[\s,]+/)
      .map(t => t.replace('#', '').trim())
      .filter(t => t.length > 0);

    onSave({
      ...(initialData || {}),
      url,
      title: title.trim() || url,
      note: note.trim(),
      tags,
      imageUrl
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel card animate-fade-in" 
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>{isEditMode ? 'Edytuj zakładkę' : 'Dodaj zakładkę'}</h2>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>Adres URL *</span>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="url" 
                required
                placeholder="https://example.com" 
                value={url} 
                onChange={e => setUrl(e.target.value)} 
                autoFocus={!isEditMode}
              />
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={fetchTitle}
                disabled={!url || isFetching}
                title="Pobierz tytuł ze strony automatycznie"
                style={{ padding: '0 0.75rem' }}
              >
                {isFetching ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Tytuł (Opcjonalnie)
            </label>
            <input 
              type="text" 
              placeholder="Wprowadź tytuł strony" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Notatka
            </label>
            <textarea 
              placeholder="Dlaczego zapisujesz ten link?" 
              value={note} 
              onChange={e => setNote(e.target.value)}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Tagi (rozdziel przecinkami)
            </label>
            <input 
              type="text" 
              placeholder="react, poradnik, inspiracje" 
              value={tagsInput} 
              onChange={e => setTagsInput(e.target.value)} 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Anuluj
            </button>
            <button type="submit" className="btn-primary">
              {isEditMode ? 'Zapisz zmiany' : 'Dodaj'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
