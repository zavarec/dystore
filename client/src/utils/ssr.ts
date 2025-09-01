import { useEffect, useState } from 'react';

// utils/ssr.ts
export const isServer = typeof window === 'undefined';
export const isClient = typeof window !== 'undefined';

// Для безопасности токены больше не храним в localStorage
export const safeLocalStorage = {
  getItem: (_key: string): string | null => null,
  setItem: (_key: string, _value: string): void => {},
};

// Хук для безопасной работы с localStorage
export const useLocalStorage = (key: string, initialValue: any) => {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const item = isClient ? window.localStorage.getItem(key) : null;
    if (item) {
      setStoredValue(JSON.parse(item));
    }
  }, [key]);

  const setValue = (value: any) => {
    setStoredValue(value);
    if (isClient) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {}
    }
  };

  return [isHydrated ? storedValue : initialValue, setValue, isHydrated];
};
