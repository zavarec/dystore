// utils/ssr.ts
export const isServer = typeof window === 'undefined';
export const isClient = typeof window !== 'undefined';

// Простой безопасный доступ к localStorage (если нужен где-то ещё)
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isClient) return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (!isClient) return;
    try {
      window.localStorage.setItem(key, value);
    } catch {}
  },
};
