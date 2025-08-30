import { apiClient } from './api';
import {
  CategoryPromoPlacement,
  CategoryPromoSection,
  CategoryPromoSectionAdmin,
  CategoryPromoVariant,
  PromoFont,
  ContentSideEnum,
} from '@/types/models/category-promo-section.model';

export interface CreateCategoryPromoSectionDto {
  categoryId: number;
  variant: CategoryPromoVariant;
  placement: CategoryPromoPlacement;
  order?: number;
  isActive?: boolean;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  videoUrl?: string;
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
  startsAt?: string; // ISO
  endsAt?: string; // ISO
}

export type UpdateCategoryPromoSectionDto = Partial<CreateCategoryPromoSectionDto>;

export class CategoryPromoSectionsService {
  static async adminList(): Promise<CategoryPromoSectionAdmin[]> {
    const { data } = await apiClient.get('/admin/category-promo-sections');
    return data;
  }

  static async create(dto: CreateCategoryPromoSectionDto): Promise<CategoryPromoSection> {
    const { data } = await apiClient.post('/admin/category-promo-sections', dto);
    return data;
  }

  static async update(
    id: number,
    dto: UpdateCategoryPromoSectionDto,
  ): Promise<CategoryPromoSection> {
    const { data } = await apiClient.patch(`/admin/category-promo-sections/${id}`, dto);
    return data;
  }

  static async remove(id: number): Promise<void> {
    await apiClient.delete(`/admin/category-promo-sections/${id}`);
  }

  // Публичный список для страницы категории по slug
  static async publicByCategorySlug(slug: string): Promise<CategoryPromoSection[]> {
    const { data } = await apiClient.get(`/categories/${slug}/promo-sections`);
    return data;
  }
}
