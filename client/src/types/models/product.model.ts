import type { Category } from './category.model';

// Базовый тип продукта (соответствует серверному API)
export interface Product {
  /** Уникальный идентификатор продукта */
  id: number;

  /** Название продукта */
  name: string;

  /** URL-слаг для красивых ссылок (например: "dyson-v15-detect") */
  slug?: string;

  /** Полное описание продукта */
  description?: string;

  /** Краткое описание продукта для карточек */
  shortDescription?: string;

  /** Цена продукта в рублях */
  price: number;

  /** Количество товара в наличии */
  stock: number;

  /** URL изображения продукта */
  imageUrl?: string;

  /** URL изображения габаритов */
  dimensionsImageUrl?: string;

  /** ID категории, к которой относится продукт */
  categoryId: number;

  /** Является ли продукт рекомендуемым */
  isFeatured: boolean;

  /** Популярность продукта (для сортировки) */
  popularity: number;

  /** Объект категории (включается при запросах с join) */
  category?: Category;

  mainImage?: {
    id: string;
    url: string; // ← это ты уже сохраняешь в files
    mimetype: string;
    storedName: string;
  } | null;
  dimensionsImage?: { id: string; url: string; mimetype: string; storedName: string } | null;
  motif?: { id: string; url: string; mimetype: string; storedName: string } | null;
  motifId?: string | null;
  motifUrl?: string | null;
}

// Расширенный тип продукта для UI (с дополнительными полями для SEO и отображения)
export interface ProductWithDetails extends Product {
  /** URL-слаг для красивых ссылок (например: "dyson-v15-detect") */
  slug: string;
  /** Оригинальная цена до скидки для отображения зачеркнутой цены */
  originalPrice?: number;
  /** Валюта цены (по умолчанию RUB) */
  currency?: string;
  /** Массив изображений продукта разных размеров и ракурсов */
  images?: ProductImage[];
  /** Технические характеристики продукта */
  specifications?: ProductSpecification[];
  /** Ключевые особенности и преимущества продукта */
  features?: string[];
  /** Средний рейтинг продукта (от 1 до 5) */
  rating?: number;
  /** Количество отзывов о продукте */
  reviewCount?: number;
  /** Бренд производителя (обычно "Dyson") */
  brand?: string;
  /** Модель продукта */
  model?: string;
  /** Артикул товара для складского учета */
  sku?: string;
  /** Теги для фильтрации и поиска */
  tags?: string[];
  /** SEO заголовок для страницы продукта */
  metaTitle?: string;
  /** SEO описание для страницы продукта */
  metaDescription?: string;
  /** Вес продукта в граммах */
  weight?: number;
  /** Габариты продукта (длина, ширина, высота) */
  dimensions?: ProductDimensions;
  /** Срок гарантии на продукт */
  warranty?: string;
  /** Доступные цветовые варианты */
  colors?: ProductColor[];
  /** Является ли продукт популярным (для секции "Популярные товары") */
  isPopular?: boolean;
  /** Является ли продукт новинкой (для секции "Новинки") */
  isNew?: boolean;
  /** Дата создания записи в ISO формате */
  createdAt?: string;
  /** Дата последнего обновления записи в ISO формате */
  updatedAt?: string;

  /** Технические характеристики продукта */
  specs?: SpecItemDto[];

  /** Комплектация */
  boxItems?: BoxItemDto[];

  mainImage?: {
    id: string;
    url: string; // ← это ты уже сохраняешь в files
    mimetype: string;
    storedName: string;
  } | null;
  dimensionsImage?: { id: string; url: string; mimetype: string; storedName: string } | null;
  motif?: { id: string; url: string; mimetype: string; storedName: string } | null;
  motifId?: string | null;
  motifUrl?: string | null;
}

export interface CreateProductDto {
  /** URL-слаг для красивых ссылок (например: "dyson-v15-detect") */
  slug: string;
  /** Название продукта */
  name: string;
  /** Описание продукта */
  description: string;
  /** Цена продукта в рублях */
  price: number;
  /** Количество товара в наличии */
  stock: number;
  /** ID категории продукта */
  categoryId: number;
  // /** URL изображения продукта */
  // imageUrl?: string;

  /** URL изображения габаритов */
  dimensionsImageUrl?: string;
  dimensionsImage?: { id: string; url: string; mimetype: string; storedName: string } | null;

  /** Является ли продукт рекомендуемым */
  isFeatured?: boolean;

  /** Комплектация */
  boxItems?: BoxItemDto[];
  /** Характеристики */
  specs?: SpecItemDto[];

  /** ID motif-изображения */
  motifId?: string;
  motifUrl?: string;
}

export interface UpdateProductDto {
  /** Новое название продукта */
  name?: string;
  /** Новое описание продукта */
  description?: string;
  /** Новое краткое описание продукта */
  shortDescription?: string;
  /** Новая цена продукта в рублях */
  price?: number;
  /** Новое количество товара в наличии */
  stock?: number;
  /** Новый ID категории продукта */
  categoryId?: number;
  /** Новый URL изображения продукта */
  imageUrl?: string;
  /** Является ли продукт рекомендуемым */
  isFeatured?: boolean;
  /** Новый URL изображения габаритов */
  dimensionsImageUrl?: string;

  /** Новый ID основного изображения */
  mainImageId?: string;
  /** Новый ID изображения габаритов */
  dimensionsImageId?: string;
  dimensionsImage?: { id: string; url: string; mimetype: string; storedName: string } | null;

  boxItems?: BoxItemDto[];
  specs?: SpecItemDto[];

  /** ID motif-изображения */
  motifId?: string;
}

export interface ProductImage {
  /** Уникальный идентификатор изображения */
  id: string;
  /** URL изображения */
  url: string;
  /** Альтернативный текст для изображения (для SEO и доступности) */
  alt: string;
  /** Ширина изображения в пикселях */
  width: number;
  /** Высота изображения в пикселях */
  height: number;
  /** Является ли это основным изображением продукта */
  isPrimary: boolean;
  /** Цветовой вариант, к которому относится изображение */
  color?: string;
}

export interface ProductSpecification {
  /** Название характеристики (например: "Время работы") */
  name: string;
  /** Значение характеристики (например: "60") */
  value: string;
  /** Единица измерения (например: "минут", "кг", "мм") */
  unit?: string;
  /** Категория характеристики (например: "Основные", "Габариты") */
  category: string;
}

export interface ProductDimensions {
  /** Длина продукта */
  length: number;
  /** Ширина продукта */
  width: number;
  /** Высота продукта */
  height: number;
  /** Единица измерения габаритов (например: "см", "мм") */
  unit: string;
}

export interface ProductColor {
  /** Название цвета (например: "Белый", "Черный") */
  name: string;
  /** HEX код цвета (например: "#FFFFFF") */
  hex: string;
  /** URL изображения продукта в данном цвете */
  image?: string;
}

/** Перечисление категорий продуктов */
export enum ProductCategory {
  /** Пылесосы */
  VACUUM_CLEANERS = 'vacuum-cleaners',
  /** Уход за волосами */
  HAIR_CARE = 'hair-care',
  /** Очистители воздуха */
  AIR_PURIFIERS = 'air-purifiers',
  /** Освещение */
  LIGHTING = 'lighting',
  /** Вентиляторы */
  FANS = 'fans',
  /** Аксессуары */
  ACCESSORIES = 'accessories',
}

export interface ProductFilter {
  /** Фильтр по категориям товаров */
  category?: ProductCategory[];
  /** Фильтр по диапазону цен */
  priceRange?: {
    /** Минимальная цена */
    min: number;
    /** Максимальная цена */
    max: number;
  };
  /** Показывать только товары в наличии */
  inStock?: boolean;
  /** Минимальный рейтинг товара */
  rating?: number;
  /** Фильтр по брендам */
  brand?: string[];
  /** Фильтр по особенностям товара */
  features?: string[];
  /** Фильтр по доступным цветам */
  colors?: string[];
}

/** Варианты сортировки продуктов */
export enum ProductSortBy {
  /** Сортировка по популярности */
  POPULARITY = 'popularity',
  /** Сортировка по цене: по возрастанию */
  PRICE_LOW_TO_HIGH = 'price-asc',
  /** Сортировка по цене: по убыванию */
  PRICE_HIGH_TO_LOW = 'price-desc',
  /** Сортировка по рейтингу */
  RATING = 'rating',
  /** Сортировка по дате: новинки */
  NEWEST = 'newest',
  /** Сортировка по названию (алфавитный порядок) */
  NAME = 'name',
}

// Для микроразметки Schema.org
export interface ProductStructuredData extends Record<string, unknown> {
  /** Контекст Schema.org */
  '@context': string;
  /** Тип объекта (обычно "Product") */
  '@type': string;
  /** Название продукта */
  name: string;
  /** Описание продукта */
  description: string;
  /** Массив URL изображений продукта */
  image: string[];
  /** Информация о бренде */
  brand: {
    /** Тип объекта бренда */
    '@type': string;
    /** Название бренда */
    name: string;
  };
  /** Информация о предложении/цене */
  offers: {
    /** Тип предложения */
    '@type': string;
    /** Цена в виде строки */
    price: string;
    /** Валюта цены */
    priceCurrency: string;
    /** Доступность товара */
    availability: string;
    /** URL страницы товара */
    url: string;
  };
  /** Агрегированный рейтинг (опционально) */
  aggregateRating?: {
    /** Тип рейтинга */
    '@type': string;
    /** Значение рейтинга */
    ratingValue: string;
    /** Количество отзывов */
    reviewCount: string;
  };
  /** Артикул товара */
  sku: string;
  /** Номер модели производителя */
  mpn: string;
}

export interface BoxItemDto {
  id?: string;
  accessoryId?: number; // либо выбираем из справочника
  customName?: string; // либо задаём вручную
  customImageId?: string;
  customImage?: {
    id: string;
    url: string; // ← это ты уже сохраняешь в files
    mimetype: string;
    storedName: string;
  };
  description?: string;
  qty: number;
  order: number;
}

export interface SpecItemDto {
  key?: string;
  attributeId: number; // если выбираем из справочника
  label?: string; // если задаём вручную
  valueString?: string;
  valueNumber?: number;
  valueBool?: boolean;
  unit?: string;
  order: number;
  customImageId?: string;
}
