import { CreatePromoSectionDto, UpdatePromoSectionDto } from '@/types/models/promo-section.model';
import { apiClient } from './api';
import {
  CreatePromoPlacementDto,
  UpdatePromoPlacementDto,
} from '@/types/models/promo-placement.model';

export class PromoService {
  static async getForPage(pageType: string, entityId: string) {
    const { data } = await apiClient.get('/promo', { params: { pageType, entityId } });
    return data;
  }
  // admin: sections
  static async listSections(q?: string) {
    const { data } = await apiClient.get('/admin/promo-sections', { params: { q } });
    return data;
  }
  static async getSection(id: number) {
    const { data } = await apiClient.get(`/admin/promo-sections/${id}`);
    return data;
  }
  static async getSectionById(id: number) {
    const { data } = await apiClient.get(`/admin/promo-sections/${id}`);
    return data;
  }
  static async createSection(dto: CreatePromoSectionDto) {
    const { data } = await apiClient.post('/admin/promo-sections', dto);
    return data;
  }
  static async updateSection(id: number, dto: UpdatePromoSectionDto) {
    const { data } = await apiClient.patch(`/admin/promo-sections/${id}`, dto);
    return data;
  }
  static async deleteSection(id: number) {
    const { data } = await apiClient.delete(`/admin/promo-sections/${id}`);
    return data;
  }
  static async createPromoSection(dto: CreatePromoSectionDto) {
    const response = await apiClient.post('/admin/promo-sections', dto);

    return response.data;
  }
  static async updatePromoSection(id: number, dto: any) {
    const response = await apiClient.patch(`/admin/promo-sections/${id}`, dto);
    return response.data;
  }
  static async deletePromoSection(id: number) {
    const response = await apiClient.delete(`/admin/promo-sections/${id}`);
    return response.data;
  }

  // admin: placements
  static async listPlacements(params?: { pageType?: string; entityId?: string }) {
    const response = await apiClient.get('/admin/promo-placements', { params });
    return response.data;
  }
  static async createPlacement(dto: CreatePromoPlacementDto) {
    const response = await apiClient.post('/admin/promo-placements', dto);
    return response.data;
  }
  static async updatePlacement(id: number, dto: UpdatePromoPlacementDto) {
    const response = await apiClient.patch(`/admin/promo-placements/${id}`, dto);
    return response.data;
  }
  static async deletePlacement(id: number) {
    const response = await apiClient.delete(`/admin/promo-placements/${id}`);
    return response.data;
  }
  static async reorderPlacements(items: { id: number; order: number }[]) {
    const response = await apiClient.post('/admin/promo-placements/reorder', { items });
    return response.data;
  }
}

export default PromoService;
