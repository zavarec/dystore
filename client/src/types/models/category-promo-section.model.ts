// Типы promo-секций категорий (синхронизировано с server/prisma/schema.prisma)

export enum CategoryPromoVariant {
  BANNER = 'BANNER',

  TEXT_STRIP = 'TEXT_STRIP',
  TEXT_QUOTE = 'TEXT_QUOTE',
  HEADLINE_STRIP = 'HEADLINE_STRIP',

  GRID = 'GRID',
  STRIP_USP = 'STRIP_USP',
  IMAGE_PAIR = 'IMAGE_PAIR',
}

export enum CategoryPromoPlacement {
  ABOVE_HERO = 'ABOVE_HERO',
  BELOW_HERO = 'BELOW_HERO',
  ABOVE_SUBCATEGORIES = 'ABOVE_SUBCATEGORIES',
  BELOW_SUBCATEGORIES = 'BELOW_SUBCATEGORIES',
  ABOVE_FILTERS = 'ABOVE_FILTERS',
  BELOW_FILTERS = 'BELOW_FILTERS',
  ABOVE_PRODUCTS = 'ABOVE_PRODUCTS',
  BETWEEN_PRODUCTS = 'BETWEEN_PRODUCTS',
  BELOW_PRODUCTS = 'BELOW_PRODUCTS',
}

export enum PromoFont {
  INTER = 'INTER',
  ROBOTO = 'ROBOTO',
  MONTSERRAT = 'MONTSERRAT',
  POPPINS = 'POPPINS',
  NUNITO_SANS = 'NUNITO_SANS',
}

export enum ContentSideEnum {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  CENTER = 'CENTER',
}

export interface CategoryPromoSection {
  id: number;
  categoryId: number;
  variant: CategoryPromoVariant;
  placement: CategoryPromoPlacement;
  order: number;
  isActive: boolean;

  title?: string | null;
  subtitle?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;

  font?: PromoFont | null;
  titleColor?: string | null;
  textColor?: string | null;
  ctaBg?: string | null;
  ctaColor?: string | null;
  bgColor?: string | null;
  contentSide?: ContentSideEnum | null;
  heightPx?: number | null;

  startsAt?: string | null;
  endsAt?: string | null;
}

// Расширенная модель из админ-эндпоинта (include: category, createdBy)
export interface CategoryPromoSectionAdmin extends CategoryPromoSection {
  category?: { id: number; name: string; slug: string };
  createdBy?: { id: string; name?: string | null; email?: string | null };
  createdAt?: string;
  updatedAt?: string;
}
