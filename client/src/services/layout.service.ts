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
  // Кэш промиса, чтобы не дублировать параллельные вызовы adminList
  _adminListPromise: null as Promise<PageSectionDTO[]> | null,

  async getHome() {
    const { data } = await apiClient.get<PageSectionDTO[]>('/layout/home');
    return data;
  },

  async adminList() {
    if (!this._adminListPromise) {
      this._adminListPromise = apiClient
        .get<PageSectionDTO[]>('/admin/layout/home')
        .then(r => r.data)
        .finally(() => {
          this._adminListPromise = null;
        });
    }
    return this._adminListPromise;
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
