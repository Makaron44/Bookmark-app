import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Plus, Download, Upload, LayoutGrid, List } from 'lucide-react';
import { 
  getBookmarks, 
  addBookmark, 
  deleteBookmark, 
  updateBookmark,
  mergeBookmarksFromJSON,
  seedInitialData 
} from './utils/storage';
import BookmarkCard from './components/BookmarkCard';
import BookmarkModal from './components/BookmarkModal';

export default function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');

  const fileInputRef = useRef(null);

  useEffect(() => {
    seedInitialData();
    setBookmarks(getBookmarks());
  }, []);

  const handleSaveBookmark = (data) => {
    if (editingBookmark) {
      updateBookmark(editingBookmark.id, data);
    } else {
      addBookmark(data);
    }
    setBookmarks(getBookmarks());
    setIsModalOpen(false);
    setEditingBookmark(null);
  };

  const handleEditClick = (bookmark) => {
    setEditingBookmark(bookmark);
    setIsModalOpen(true);
  };

  const handleDeleteBookmark = (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę zakładkę?')) {
      deleteBookmark(id);
      setBookmarks(getBookmarks());
    }
  };

  const handleTagClick = (tag) => {
    setActiveTag(activeTag === tag ? null : tag);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bookmarks, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "markd-backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        const addedCount = mergeBookmarksFromJSON(importedData);
        setBookmarks(getBookmarks());
        alert(`Pomyślnie zaimportowano plik. Dodano ${addedCount} nowych wpisów.`);
      } catch (error) {
        console.error('Błąd importu:', error);
        alert('Plik jest uszkodzony lub ma nieprawidłowy format JSON.');
      }
      e.target.value = null; // Zresetuj input
    };
    reader.readAsText(file);
  };

  // Zbieranie wszystkich unikalnych tagów
  const allTags = useMemo(() => {
    const tagsSet = new Set();
    bookmarks.forEach(b => {
      b.tags?.forEach(t => tagsSet.add(t));
    });
    return Array.from(tagsSet).sort();
  }, [bookmarks]);

  // Filtrowanie i sortowanie
  const processedBookmarks = useMemo(() => {
    let result = bookmarks.filter(b => {
      const matchQuery = (b.title + ' ' + b.url + ' ' + b.note).toLowerCase().includes(searchQuery.toLowerCase());
      const matchTag = activeTag ? b.tags?.includes(activeTag) : true;
      return matchQuery && matchTag;
    });

    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'alpha') return (a.title || a.url).localeCompare(b.title || b.url);
      return 0;
    });

    return result;
  }, [bookmarks, searchQuery, activeTag, sortBy]);

  return (
    <div className="app-container">
      <header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)', margin: 0, fontSize: '1.5rem' }}>
            🔖 Markd
          </h1>
          
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <input type="file" accept=".json" style={{ display: 'none' }} ref={fileInputRef} onChange={handleImportJSON} />
            <button className="btn-icon" onClick={() => fileInputRef.current.click()} title="Importuj (JSON)">
              <Upload size={18} />
            </button>
            <button className="btn-icon" onClick={handleExportJSON} title="Eksportuj (JSON)">
              <Download size={18} />
            </button>
            <button 
              className="btn-primary"
              style={{ marginLeft: '0.5rem' }}
              onClick={() => {
                setEditingBookmark(null);
                setIsModalOpen(true);
              }}
            >
              <Plus size={18} />
              <span className="mobile-hidden">Dodaj zakładkę</span>
            </button>
          </div>
        </div>

        <div className="header-filters" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search-container" style={{ flex: '1 1 auto', minWidth: '200px' }}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              className="search-input shadow-sm"
              placeholder="Szukaj zakładki..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="view-controls" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-color-light)', padding: '0.25rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <button 
                className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`} 
                style={{ background: viewMode === 'grid' ? 'var(--accent-color)' : 'transparent', color: viewMode === 'grid' ? '#fff' : 'inherit' }}
                onClick={() => setViewMode('grid')}
                title="Widok Siatki"
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                className={`btn-icon ${viewMode === 'list' ? 'active' : ''}`} 
                style={{ background: viewMode === 'list' ? 'var(--accent-color)' : 'transparent', color: viewMode === 'list' ? '#fff' : 'inherit' }}
                onClick={() => setViewMode('list')}
                title="Widok Listy"
              >
                <List size={16} />
              </button>
            </div>

            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              style={{ 
                background: 'var(--bg-color-light)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: 'var(--radius-sm)', padding: '0.5rem', outline: 'none', height: '100%', minHeight: '38px', fontSize: '0.85rem'
              }}
            >
              <option value="newest">Najnowsze</option>
              <option value="oldest">Najstarsze</option>
              <option value="alpha">A-Z</option>
            </select>
          </div>
        </div>

        {allTags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }} className="animate-fade-in">
            {allTags.map((tag) => (
              <button 
                key={tag} 
                className={`tag ${activeTag === tag ? 'active' : ''}`}
                onClick={() => handleTagClick(tag)}
                style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </header>

      <main>
        {processedBookmarks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Nie znaleziono zakładek po tych kryteriach.</p>
          </div>
        ) : (
          <div style={{ 
            display: viewMode === 'grid' ? 'grid' : 'flex', 
            flexDirection: 'column',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: viewMode === 'grid' ? '1.5rem' : '0' 
          }}>
            {processedBookmarks.map(b => (
              <BookmarkCard 
                key={b.id} 
                bookmark={b} 
                viewMode={viewMode}
                onDelete={handleDeleteBookmark}
                onEdit={handleEditClick}
                onTagClick={handleTagClick}
              />
            ))}
          </div>
        )}
      </main>

      {isModalOpen && (
        <BookmarkModal 
          onClose={() => {
            setIsModalOpen(false);
            setEditingBookmark(null);
          }} 
          onSave={handleSaveBookmark} 
          initialData={editingBookmark}
        />
      )}
    </div>
  );
}
