import { apiClient } from './api';
import { SeoMeta, SeoPageType, UpsertSeoMetaRequest } from '@/types/models/seo-meta.model';

export class SeoMetaService {
  static async list(params?: { pageType?: SeoPageType; entityId?: string; locale?: string }) {
    const { data } = await apiClient.get<SeoMeta[]>('/admin/seo-meta', { params });
    return data;
  }

  static async getOne(pageType: SeoPageType, entityId: string, locale = 'ru') {
    const { data } = await apiClient.get<SeoMeta>(`/seo-meta/${pageType}/${entityId}`, {
      params: { locale },
    });
    return data;
  }

  static async upsert(payload: UpsertSeoMetaRequest) {
    const { data } = await apiClient.post<SeoMeta>('/admin/seo-meta/upsert', payload);
    return data;
  }

  static async remove(id: number) {
    const { data } = await apiClient.delete<{ success: boolean }>(`/admin/seo-meta/${id}`);
    return data;
  }
}

export default SeoMetaService;



