import type { ResponsivePadding } from '@/features/promo-block/components/promo-carousel-section/promo-carousel-section';

export enum PromoVariant {
  BANNER = 'BANNER',

  TEXT_STRIP = 'TEXT_STRIP',
  TEXT_QUOTE = 'TEXT_QUOTE',
  HEADLINE_STRIP = 'HEADLINE_STRIP',

  GRID = 'GRID',
  STRIP_USP = 'STRIP_USP',
  IMAGE_PAIR = 'IMAGE_PAIR',

  CAROUSEL = 'CAROUSEL',
}

export enum PromoSlot {
  ABOVE_HERO = 'ABOVE_HERO',
  BELOW_HERO = 'BELOW_HERO',
  ABOVE_SUBCATEGORIES = 'ABOVE_SUBCATEGORIES',
  BELOW_SUBCATEGORIES = 'BELOW_SUBCATEGORIES',
  ABOVE_FILTERS = 'ABOVE_FILTERS',
  BELOW_FILTERS = 'BELOW_FILTERS',
  ABOVE_PRODUCTS = 'ABOVE_PRODUCTS',
  BETWEEN_PRODUCTS = 'BETWEEN_PRODUCTS',
  BELOW_PRODUCTS = 'BELOW_PRODUCTS',

  PDP_FEATURES = 'PDP_FEATURES',
  PDP_BELOW_GALLERY = 'PDP_BELOW_GALLERY',
  PDP_BELOW_SPECS = 'PDP_BELOW_SPECS',
  PDP_BELOW_ACCESSORY = 'PDP_BELOW_ACCESSORY',
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

export interface PromoSection {
  id: number;
  categoryId: number;
  variant: PromoVariant;
  placement: PromoSlot;
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

  paddingTopPx?: number | null;
  paddingBottomPx?: number | null;
  contentFontSizePx?: number | null;
  titleFontSizePx?: number | null;

  content?: unknown | null;

  startsAt?: string | null;
  endsAt?: string | null;
  source?: string | null;
  padding?: ResponsivePadding;
}

// Расширенная модель из админ-эндпоинта (include: category, createdBy)
export interface CategoryPromoSectionAdmin extends PromoSection {
  category?: { id: number; name: string; slug: string };
  createdBy?: { id: string; name?: string | null; email?: string | null };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePromoSectionDto {
  variant: PromoVariant;

  title?: string;
  subtitle?: string;
  imageUrl?: string | undefined;
  videoUrl?: string | undefined;
  ctaText?: string;
  ctaLink?: string;

  font?: PromoFont;
  titleColor?: string;
  textColor?: string;
  ctaBg?: string;
  ctaColor?: string;
  bgColor?: string;
  contentSide?: ContentSideEnum;
  heightPx?: number;

  paddingTopPx?: number;
  paddingBottomPx?: number;
  contentFontSizePx?: number;
  titleFontSizePx?: number;

  content?: unknown;

  startsAt?: string; // ISO
  endsAt?: string; // ISO
  isActive?: boolean;

  createdById?: string;
}

export type UpdatePromoSectionDto = Partial<CreatePromoSectionDto>;
