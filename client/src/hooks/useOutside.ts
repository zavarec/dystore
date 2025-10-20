import { useEffect } from 'react';

export const useOutside = (ref: React.RefObject<HTMLElement>, cb: () => void) => {
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [ref, cb]);
};
