import { apiClient } from './api';

export interface PageSectionDTO {
  id: number;
  page: 'HOME';
  key: 'PRODUCT_OF_DAY' | 'FEATURED' | 'CUSTOM' | 'HITS';
  title?: string | null;
  isEnabled: boolean;
  position: number;
  settings?: Record<string, unknown> | null;
}

export const LayoutService = {
  async getHome() {
    const { data } = await apiClient.get<PageSectionDTO[]>('/layout/home');
    return data;
  },

  async adminList() {
    const { data } = await apiClient.get<PageSectionDTO[]>('/admin/layout/home');
    return data;
  },

  async reorder(items: { id: number; position: number }[]) {
    const { data } = await apiClient.patch<PageSectionDTO[]>('/admin/layout/home/reorder', items);
    return data;
  },

  async updateSection(
    id: number,
    body: Partial<Pick<PageSectionDTO, 'title' | 'isEnabled' | 'settings'>>,
  ) {
    const { data } = await apiClient.patch<PageSectionDTO>(
      `/admin/layout/home/section/${id}`,
      body,
    );
    return data;
  },
};
