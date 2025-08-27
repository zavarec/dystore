import { Promotion, PromotionSlot } from '@/types/models/promotion.model';
import { apiClient } from './api';

export class PromotionsService {
  /** @param slot Слот (HERO, PRODUCT_OF_DAY, FEATURED, CUSTOM) */

  static async getActiveBySlot(slot: PromotionSlot): Promise<Promotion[] | Promotion | null> {
    const response = await apiClient.get(`/promotions/slot/${slot}/active`);
    // Бэкенд: HERO/FEATURED/CUSTOM → массив, PRODUCT_OF_DAY → объект или null
    if (slot === PromotionSlot.PRODUCT_OF_DAY) return response.data ?? null;
    return Array.isArray(response.data) ? response.data : [];
  }

  static async createPromotion(dto: Partial<Promotion>): Promise<Promotion> {
    const res = await apiClient.post('/admin/promotions', dto);
    return res.data;
  }

  static async removePromotion(id: number): Promise<void> {
    await apiClient.delete(`/admin/promotions/${id}`);
  }

  static async updatePromotion(id: number, dto: Partial<Promotion>): Promise<Promotion> {
    const res = await apiClient.patch(`/admin/promotions/${id}`, dto);
    return res.data;
  }
}
