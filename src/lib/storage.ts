// Storage utility with compression and IndexedDB fallback

const DB_NAME = 'PoseMasterDB';
const STORE_NAME = 'images';
const DB_VERSION = 1;

// Initialize IndexedDB
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

// Compress image to reduce size
const compressImage = (dataUrl: string, maxWidth: number = 1200, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to compressed JPEG
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
};

// Save to IndexedDB
const saveToIndexedDB = async (key: string, value: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(value, key);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Get from IndexedDB
const getFromIndexedDB = async (key: string): Promise<string | null> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);
    
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

// Main storage functions
export const saveImage = async (key: string, dataUrl: string): Promise<void> => {
  try {
    // Try to compress image first
    const compressed = await compressImage(dataUrl);
    
    // Try sessionStorage first (faster)
    try {
      sessionStorage.setItem(key, compressed);
    } catch (sessionError) {
      // If sessionStorage fails, use IndexedDB
      console.log('SessionStorage full, using IndexedDB fallback');
      await saveToIndexedDB(key, compressed);
      // Mark that we're using IndexedDB for this key
      sessionStorage.setItem(`${key}_useIndexedDB`, 'true');
    }
  } catch (error) {
    console.error('Failed to save image:', error);
    throw error;
  }
};

export const getImage = async (key: string): Promise<string | null> => {
  try {
    // Check if we should use IndexedDB
    const useIndexedDB = sessionStorage.getItem(`${key}_useIndexedDB`) === 'true';
    
    if (useIndexedDB) {
      return await getFromIndexedDB(key);
    }
    
    // Try sessionStorage first
    const sessionData = sessionStorage.getItem(key);
    if (sessionData) {
      return sessionData;
    }
    
    // Fallback to IndexedDB
    return await getFromIndexedDB(key);
  } catch (error) {
    console.error('Failed to get image:', error);
    return null;
  }
};

export const saveData = (key: string, value: string): void => {
  try {
    sessionStorage.setItem(key, value);
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};

export const getData = (key: string): string | null => {
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    console.error('Failed to get data:', error);
    return null;
  }
};
