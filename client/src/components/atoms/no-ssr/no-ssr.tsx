import { useEffect, useState } from 'react';

interface NoSSRProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Компонент NoSSR предотвращает рендеринг дочерних элементов на сервере
 * и показывает их только после гидратации на клиенте.
 *
 * Используйте для компонентов, которые критически зависят от клиентского состояния
 * (localStorage, window объекты, браузерные API)
 */
export const NoSSR: React.FC<NoSSRProps> = ({ children, fallback = null }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // На сервере и до гидратации показываем fallback
  if (!hasMounted) {
    return <>{fallback}</>;
  }

  // После гидратации показываем реальный контент
  return <>{children}</>;
};
