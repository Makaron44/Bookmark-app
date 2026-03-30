const STORAGE_KEY = 'markd_bookmarks';

export const getBookmarks = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveBookmarks = (bookmarks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
};

export const addBookmark = (bookmark) => {
  const bookmarks = getBookmarks();
  const newBookmark = {
    ...bookmark,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  saveBookmarks([newBookmark, ...bookmarks]);
  return newBookmark;
};

export const mergeBookmarksFromJSON = (importedData) => {
  if (!Array.isArray(importedData)) return;
  const current = getBookmarks();
  
  // Słownik istniejących urli (by uniknąć duplikatów)
  const existingUrls = new Set(current.map(b => b.url.toLowerCase()));
  
  const newValidBookmarks = [];
  importedData.forEach(item => {
    // Sprawdzamy czy ma URL i czy go nie ma już w bazie (Opcja B: Łączymy, odrzucamy duplikaty)
    if (item.url && !existingUrls.has(item.url.toLowerCase())) {
      newValidBookmarks.push({
        ...item,
        id: item.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: item.createdAt || new Date().toISOString(),
      });
    }
  });

  if (newValidBookmarks.length > 0) {
    saveBookmarks([...newValidBookmarks, ...current]);
  }
  
  return newValidBookmarks.length; // Zwracamy ile dodano
};

export const updateBookmark = (id, updatedFields) => {
  const bookmarks = getBookmarks();
  const updated = bookmarks.map(b => (b.id === id ? { ...b, ...updatedFields } : b));
  saveBookmarks(updated);
};

export const deleteBookmark = (id) => {
  const bookmarks = getBookmarks();
  saveBookmarks(bookmarks.filter(b => b.id !== id));
};

// Seed some initial data if empty
export const seedInitialData = () => {
  if (getBookmarks().length === 0) {
    const initial = [
      {
        id: '1',
        title: 'React Documentation',
        url: 'https://react.dev',
        note: 'The new official React docs. Very good for learning hooks.',
        tags: ['react', 'docs', 'frontend'],
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Vite',
        url: 'https://vitejs.dev',
        note: 'Next Generation Frontend Tooling',
        tags: ['vite', 'tooling'],
        createdAt: new Date().toISOString(),
      }
    ];
    saveBookmarks(initial);
  }
};
