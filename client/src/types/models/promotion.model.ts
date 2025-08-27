/**
 * Слот, в котором будет показано промо
 */
// export type PromotionSlot = 'HERO' | 'PRODUCT_OF_DAY' | 'FEATURED' | 'CUSTOM';

export enum PromotionSlot {
  HERO = 'HERO',
  PRODUCT_OF_DAY = 'PRODUCT_OF_DAY',
  FEATURED = 'FEATURED',
  CUSTOM = 'CUSTOM',
}

export enum PromoFont {
  INTER = 'INTER',
  ROBOTO = 'ROBOTO',
  MONTSERRAT = 'MONTSERRAT',
  POPPINS = 'POPPINS',
}

/**
 * Промо-акция для отображения на витрине
 */
export interface Promotion {
  /** Уникальный идентификатор промо */
  id: number;

  /** Слот, к которому относится промо (Hero, Product of the Day и т.д.) */
  slot: PromotionSlot;

  /** Заголовок промо (отображается крупным шрифтом) */
  title?: string;

  /** Подзаголовок промо (дополнительное описание) */
  subtitle?: string;

  /** Текст кнопки действия (CTA), например "Купить" */
  ctaText?: string;

  /** Ссылка для кнопки CTA. Может быть внутренняя (/category/...) или внешняя (https://...) */
  ctaLink?: string;

  /** Фоновая картинка */
  bgImageUrl?: string;

  /** Фоновое видео */
  bgVideoUrl?: string;

  /** Признак публикации (true = показывать на витрине) */
  isPublished: boolean;

  /** Дата и время начала активности */
  startAt: string; // ISO string

  /** Дата и время окончания активности */
  endAt: string; // ISO string

  /** Порядок сортировки внутри слота (чем меньше число, тем выше элемент) */
  position: number;

  /** Привязанный товар (опционально). Если указан, можно показать цену/ссылку на карточку */
  product?: {
    /** ID товара */
    id: number;
    /** slug товара (для ссылки) */
    slug: string;
    /** Название */
    name: string;
    /** Цена */
    price: number;
    /** Картинка товара */
    imageUrl?: string;
  } | null;

  // Стили
  font?: PromoFont;
  titleColor?: string;
  textColor?: string;
  ctaBg?: string;
  ctaColor?: string;
}
