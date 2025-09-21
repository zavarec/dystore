import { apiClient } from './api';

export interface SpecAttributeDto {
  id: number;
  key: string;
  label: string;
  unit?: string; // null с бэка воспринимаем как отсутствующее значение
  group?: string;
  order: number;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN';
}

export interface CreateSpecAttributeDto {
  key: string;
  label: string;
  unit?: string | null;
  group?: string | null;
  order?: number;
  type?: 'STRING' | 'NUMBER' | 'BOOLEAN';
}

export class SpecAttributesService {
  static async list(q?: string): Promise<SpecAttributeDto[]> {
    const response = await apiClient.get<SpecAttributeDto[]>('/spec-attributes', {
      params: q ? { q } : undefined,
    });

    return response.data;
  }

  static async create(dto: CreateSpecAttributeDto): Promise<SpecAttributeDto> {
    const response = await apiClient.post<SpecAttributeDto>('/spec-attributes', dto);
    return response.data;
  }
}

export default SpecAttributesService;
