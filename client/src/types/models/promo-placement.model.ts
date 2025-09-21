import { ContentSideEnum, PromoSection } from './promo-section.model';

export enum PromoPageType {
  CATEGORY = 'CATEGORY',
  PRODUCT = 'PRODUCT',
  LANDING = 'LANDING',
  STATIC = 'STATIC',
}

export enum PromoEntityType {
  CATEGORY_PROMO_SECTION = 'CATEGORY_PROMO_SECTION',
}

export interface PromoPlacement {
  id: number;

  pageType: PromoPageType;
  entityId: string;
  slot: PromoSlot;
  order: number;
  isActive: boolean;

  entityType: PromoEntityType;
  promoSectionId?: number | null;
  promoSection?: (Partial<PromoSection> & { id: number }) | null;

  // overrides
  fullWidth?: boolean | null;
  marginTop?: number | null;
  marginBottom?: number | null;
  bgColor?: string | null;
  contentSide?: ContentSideEnum | null;
  zIndex?: number | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePromoPlacementDto {
  pageType: PromoPageType;
  entityId: string;
  slot: PromoSlot;

  promoSectionId: number;

  order?: number;
  isActive?: boolean;

  fullWidth?: boolean;
  marginTop?: number;
  marginBottom?: number;
  bgColor?: string;
  contentSide?: ContentSideEnum;
  zIndex?: number;
}

export type UpdatePromoPlacementDto = CreatePromoPlacementDto;

// DTO для reorder
export interface PromoPlacementReorderItem {
  id: number;
  order: number;
}

export interface PromoPlacementReorderDto {
  items: PromoPlacementReorderItem[];
}

export type PromoSlot =
  | 'ABOVE_HERO'
  | 'BELOW_HERO'
  | 'ABOVE_SUBCATEGORIES'
  | 'BELOW_SUBCATEGORIES'
  | 'ABOVE_FILTERS'
  | 'BELOW_FILTERS'
  | 'ABOVE_PRODUCTS'
  | 'BETWEEN_PRODUCTS'
  | 'BELOW_PRODUCTS';

export interface PromoSectionDTO {
  id: number;
  variant: string;
  title?: string | null;
  subtitle?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  font?: string | null;
  titleColor?: string | null;
  textColor?: string | null;
  ctaBg?: string | null;
  ctaColor?: string | null;
  bgColor?: string | null;
  contentSide?: 'LEFT' | 'RIGHT' | 'CENTER' | null;
  heightPx?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive: boolean;
}

export interface PromoPlacementDTO {
  id: number;
  pageType: PromoPageType;
  entityId: string;
  slot: PromoSlot;
  order: number;
  isActive: boolean;
  promoSectionId: number;

  fullWidth?: boolean | null;
  marginTop?: number | null;
  marginBottom?: number | null;
  bgColor?: string | null;
  contentSide?: 'LEFT' | 'RIGHT' | 'CENTER' | null;
  zIndex?: number | null;

  promoSection?: PromoSectionDTO; // include
}
