// src/components/boot/FirstVisitBoot.tsx
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/redux';

// Импортируйте ваши реальные thunks:
/// import { fetchCategories } from '@/store/slices/category/category.thunks';
/// import { fetchFeatured } from '@/store/slices/product/product.thunks';
/// import { fetchCart } from '@/store/slices/cart-slice/cart.thunks';

type BootProps = {
  /** Сколько максимум держать оверлей, мс (страховка) */
  maxDelayMs?: number; // по умолчанию 1000–1500 — комфортно
};

export const FirstVisitBoot: React.FC<BootProps> = ({ maxDelayMs = 30000 }) => {
  const dispatch = useAppDispatch();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const key = 'boot-done';
    const seen = sessionStorage.getItem(key);
    if (seen) return; // уже загружали — выходим

    setShow(true);

    // Соберите ваши реальные загрузки:
    const tasks: Array<Promise<any>> = [];

    // Примеры — замените на ваши thunks/запросы:
    // tasks.push(dispatch(fetchCategories()).unwrap());
    // tasks.push(dispatch(fetchFeatured()).unwrap());
    // tasks.push(dispatch(fetchCart()).unwrap());

    // Можно дополнительно «прогреть» эндпоинты напрямую:
    // tasks.push(fetch('/api/health').then(() => {}));

    // Страхуемся таймаутом, чтобы не держать экран вечность
    const timeout = new Promise<void>(resolve => setTimeout(resolve, maxDelayMs));

    Promise.race([
      // ждём хотя бы таймаут, а лучше — пока завершится весь прелоад (что раньше)
      Promise.allSettled(tasks).then(() => {}),
      timeout,
    ])
      .catch(() => {}) // игнорим, нам важен UX
      .finally(() => {
        sessionStorage.setItem(key, '1');
        // маленькая задержка, чтобы анимация красиво ушла
        setTimeout(() => setShow(false), 50);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!show) return null;
  return <div className="first-visit-overlay" aria-hidden="true" />;
};
