import { useState, useRef } from 'react';

export const useDropdownToggle = (delay = 300) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const open = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const close = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), delay);
  };

  const cancelClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // if (timeoutId) {
    //   clearTimeout(timeoutId);
    //   setTimeoutId(null);
    // }
    open();
  };

  return { isOpen, open, close, cancelClose };
};
