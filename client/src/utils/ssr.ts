import { useEffect, useState } from 'react';

// utils/ssr.ts
export const isServer = typeof window === 'undefined';
export const isClient = typeof window !== 'undefined';

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (isServer) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (isServer) return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Handle quota exceeded
    }
  },
};

// Хук для безопасной работы с localStorage
export const useLocalStorage = (key: string, initialValue: any) => {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const item = safeLocalStorage.getItem(key);
    if (item) {
      setStoredValue(JSON.parse(item));
    }
  }, [key]);

  const setValue = (value: any) => {
    setStoredValue(value);
    safeLocalStorage.setItem(key, JSON.stringify(value));
  };

  return [isHydrated ? storedValue : initialValue, setValue, isHydrated];
};
