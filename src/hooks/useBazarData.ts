import { useState, useEffect } from 'react';
import { AppData, ShoppingItem, Category, Theme, Language } from '../types';
import { DEFAULT_CATEGORIES, APP_STORAGE_KEY } from '../constants';

export function useBazarData() {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(APP_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const customCategories = (parsed.categories || []).filter((c: Category) => c.isCustom);
        const allCurrentCategories = [...DEFAULT_CATEGORIES, ...customCategories];
        
        const items = (parsed.items || []).map((item: ShoppingItem) => {
          const categoryExists = allCurrentCategories.some(c => c.id === item.categoryId);
          if (!categoryExists) {
            return { ...item, categoryId: '10' };
          }
          return item;
        });

        return {
          items,
          categories: allCurrentCategories,
          theme: parsed.theme || 'system',
          language: parsed.language || 'bn',
          currencyCode: parsed.currencyCode || 'BDT',
          isFirstLaunch: parsed.isFirstLaunch !== undefined ? parsed.isFirstLaunch : true,
        };
      } catch (e) {
        console.error('Failed to parse storage data', e);
      }
    }
    return {
      items: [],
      categories: DEFAULT_CATEGORIES,
      theme: 'system',
      language: 'bn',
      currencyCode: 'BDT',
      isFirstLaunch: true,
    };
  });

  useEffect(() => {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(data));
    
    const applyTheme = (theme: Theme) => {
      if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme(data.theme);

    if (data.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme('system');
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [data]);

  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  };

  const addItem = (name: string, categoryId: string, quantity?: string, price?: number) => {
    const newItem: ShoppingItem = {
      id: generateId(),
      name,
      quantity,
      categoryId,
      completed: false,
      createdAt: Date.now(),
      price,
    };
    setData((prev) => ({ ...prev, items: [newItem, ...prev.items] }));
  };

  const toggleItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  const setItemPriceAndCompleted = (id: string, price: number, completed: boolean) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, price, completed } : item
      ),
    }));
  };

  const updateItemPrice = (id: string, price: number) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, price } : item
      ),
    }));
  };

  const deleteItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const clearAllItems = () => {
    setData((prev) => ({ ...prev, items: [] }));
  };

  const addCategory = (name: string, icon: string = '🛍️') => {
    const newCategory: Category = {
      id: generateId(),
      name: `${icon} ${name}`,
      isCustom: true,
      color: '#94A3B8',
      icon: icon,
    };
    setData((prev) => ({ ...prev, categories: [...prev.categories, newCategory] }));
  };

  const deleteCategory = (id: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id || !c.isCustom),
    }));
  };

  const setTheme = (theme: Theme) => {
    setData((prev) => ({ ...prev, theme }));
  };

  const setLanguage = (language: Language) => {
    setData((prev) => ({ ...prev, language }));
  };

  const setCurrencyCode = (currencyCode: string) => {
    setData((prev) => ({ ...prev, currencyCode }));
  };

  const setFirstLaunchComplete = () => {
    setData((prev) => ({ ...prev, isFirstLaunch: false }));
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bazar_list_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.items && parsed.categories) {
        setData(parsed);
        return true;
      }
    } catch (e) {
      console.error('Import failed', e);
    }
    return false;
  };

  return {
    items: data.items,
    categories: data.categories,
    theme: data.theme,
    language: data.language,
    currencyCode: data.currencyCode || 'BDT',
    isFirstLaunch: data.isFirstLaunch,
    addItem,
    toggleItem,
    setItemPriceAndCompleted,
    updateItemPrice,
    deleteItem,
    clearAllItems,
    addCategory,
    deleteCategory,
    setTheme,
    setLanguage,
    setCurrencyCode,
    setFirstLaunchComplete,
    exportData,
    importData,
  };
}
