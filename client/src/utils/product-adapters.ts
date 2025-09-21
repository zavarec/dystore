import { Product, ProductWithDetails } from '@/types/models/product.model';

/**
 * Преобразует продукт из API в расширенный формат для UI
 */
export const adaptProductForUI = (product: Product): ProductWithDetails => {
  console.log('Adapting product:', product.name, 'mainImage:', product.mainImage);

  // Используем slug из БД, а генерируем из названия только если его нет
  const slug =
    product.slug && product.slug.trim().length > 0
      ? product.slug
      : product.name
          .toLowerCase()
          .replace(/[^a-zA-Zа-яё0-9\s-]/g, '')
          .replace(/\s+/g, '-');

  // Определяем статусы на основе реальных данных
  const isPopular = product.popularity > 400; // Популярные = высокая популярность
  const isNew = product.id % 3 === 0; // Каждый третий как новинка
  // isFeatured уже приходит из API

  // Создаем изображения на основе данных из API
  const images = product.mainImage
    ? [
        {
          id: product.mainImage.id,
          url: product.mainImage.url,
          alt: product.name,
          width: 800,
          height: 800,
          isPrimary: true,
        },
      ]
    : [
        {
          id: `${product.id}-1`,
          url: '/images/placeholder.webp',
          alt: product.name,
          width: 800,
          height: 800,
          isPrimary: true,
        },
      ];

  // Базовые характеристики на основе цены
  const specifications = [
    {
      name: 'Цена',
      value: product.price.toString(),
      unit: '₽',
      category: 'Основные',
    },
    {
      name: 'В наличии',
      value: product.stock.toString(),
      unit: 'шт',
      category: 'Наличие',
    },
  ];

  // Базовые особенности
  const features = ['Официальная гарантия', 'Быстрая доставка', 'Техподдержка 24/7'];

  // Создаем originalPrice для отображения скидки (15-25% скидка)
  const discountPercent = 0.15 + Math.random() * 0.1; // 15-25%
  const originalPrice = Math.round(product.price / (1 - discountPercent));

  return {
    ...product,
    slug,
    originalPrice,
    currency: 'RUB',
    images,
    specifications,
    features,
    rating: 4.0 + Math.random() * 1.0, // Случайный рейтинг 4.0-5.0
    reviewCount: Math.floor(Math.random() * 800) + 200, // 200-1000 отзывов
    brand: 'Dyson',
    warranty: '2 года',
    isPopular,
    isNew,
    metaTitle: `${product.name} - Купить в DysonGroup`,
    metaDescription: `${product.shortDescription || product.name}. Официальная гарантия. Быстрая доставка. Лучшие цены.`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Преобразует массив продуктов из API
 */
export const adaptProductsForUI = (products: Product[]): ProductWithDetails[] => {
  return products.map(adaptProductForUI);
};

/**
 * Фильтрует популярные продукты
 */
export const getPopularProducts = (products: ProductWithDetails[]): ProductWithDetails[] => {
  return products.filter(product => product.isPopular);
};

/**
 * Фильтрует рекомендуемые продукты
 */
export const getFeaturedProducts = (products: ProductWithDetails[]): ProductWithDetails[] => {
  return products.filter(product => product.isFeatured).slice(0, 3);
};

/**
 * Фильтрует новые продукты
 */
export const getNewProducts = (products: ProductWithDetails[]): ProductWithDetails[] => {
  return products.filter(product => product.isNew);
};

/**
 * Находит продукт по slug
 */
export const getProductBySlug = (
  products: ProductWithDetails[],
  slug: string,
): ProductWithDetails | undefined => {
  return products.find(product => product.slug === slug);
};

/**
 * Фильтрует продукты по категории
 */
export const getProductsByCategory = (
  products: ProductWithDetails[],
  categoryId: number,
): ProductWithDetails[] => {
  return products.filter(product => product.categoryId === categoryId);
};
