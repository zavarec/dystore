import { useEffect, useState } from 'react';

export function useIsOverflow(ref: React.RefObject<HTMLElement>) {
  const [isOverflow, setOverflow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => setOverflow(el.scrollWidth > el.clientWidth + 1);

    check();

    const ro = new ResizeObserver(check);
    ro.observe(el);

    const mo = new MutationObserver(check);
    mo.observe(el, { childList: true, subtree: true });

    window.addEventListener('resize', check);
    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener('resize', check);
    };
  }, [ref]);

  return isOverflow;
}
