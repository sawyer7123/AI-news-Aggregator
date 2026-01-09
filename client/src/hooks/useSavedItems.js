import { useState, useEffect } from 'react';

const STORAGE_KEY = 'ai-news-aggregator-saved';

export function useSavedItems() {
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedItems(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse saved items:', e);
      }
    }
  }, []);

  const saveItem = (item) => {
    setSavedItems(prev => {
      if (prev.some(saved => saved.id === item.id)) {
        return prev;
      }
      const updated = [{ ...item, savedAt: new Date().toISOString() }, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (itemId) => {
    setSavedItems(prev => {
      const updated = prev.filter(item => item.id !== itemId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const savedIds = new Set(savedItems.map(item => item.id));

  return { savedItems, savedIds, saveItem, removeItem };
}
