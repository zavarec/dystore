import { apiClient } from './api';
import type { FileListResponse, UploadedFile, UploadResponse } from '@/types/upload';

export class UploadsService {
  static async uploadSingle(
    file: File,
    extra?: Record<string, string | Blob>,
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (extra) {
      Object.entries(extra).forEach(([key, value]) => formData.append(key, value));
    }
    const response = await apiClient.post<UploadResponse>('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  static async uploadMultiple(
    files: File[],
    extra?: Record<string, string | Blob>,
  ): Promise<UploadResponse> {
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    if (extra) {
      Object.entries(extra).forEach(([key, value]) => formData.append(key, value));
    }

    const response = await apiClient.post<UploadResponse>('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Убираем автоматическое добавление Content-Type из apiClient
      transformRequest: [data => data],
    });
    return response.data;
  }

  static async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
  }): Promise<FileListResponse> {
    const response = await apiClient.get<FileListResponse>('/upload/files', { params });
    return response.data;
  }

  static async info(id: string): Promise<UploadedFile> {
    const response = await apiClient.get<UploadedFile>(`/upload/files/${id}`);
    return response.data;
  }

  static viewUrl(name: string): string {
    return `${apiClient.defaults.baseURL}/upload/files/${encodeURIComponent(name)}/view`;
  }

  static downloadUrl(name: string): string {
    return `${apiClient.defaults.baseURL}/upload/files/${encodeURIComponent(name)}/download`;
  }

  static thumbnailUrl(id: string, width?: number, height?: number): string {
    const query = new URLSearchParams();
    if (width) query.set('width', String(width));
    if (height) query.set('height', String(height));
    const q = query.toString();
    return `${apiClient.defaults.baseURL}/upload/files/${encodeURIComponent(id)}/thumbnail${q ? `?${q}` : ''}`;
  }

  static async updateMeta(
    id: string,
    data: Partial<Pick<UploadedFile, 'alt' | 'description' | 'filename' | 'type'>>,
  ): Promise<UploadedFile> {
    const response = await apiClient.patch<UploadedFile>(`/upload/files/${id}`, data);
    return response.data;
  }

  static async remove(id: string): Promise<{ success: boolean }> {
    await apiClient.delete(`/upload/files/${id}`);
    return { success: true };
  }

  static async stats(): Promise<Record<string, unknown>> {
    const response = await apiClient.get<Record<string, unknown>>('/upload/stats');
    return response.data;
  }

  static async setMainImage(productId: string, fileId: string): Promise<UploadedFile> {
    const response = await apiClient.patch<UploadedFile>(`/upload/files/${productId}/main-image`, {
      fileId,
    });
    return response.data;
  }

  static async setDimensionsImage(productId: string, fileId: string): Promise<UploadedFile> {
    const response = await apiClient.patch<UploadedFile>(
      `/upload/files/${productId}/dimensions-image`,
      {
        fileId,
      },
    );
    return response.data;
  }
}

export default UploadsService;
