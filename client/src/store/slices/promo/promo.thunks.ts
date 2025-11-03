import { createAsyncThunk } from '@reduxjs/toolkit';

import { PromoService } from '@/services/promo.service';
import type {
  CreatePromoSectionDto,
  PromoSection,
  UpdatePromoSectionDto,
} from '@/types/models/promo-section.model';

export const listPromoSections = createAsyncThunk('promo/sections/list', async (q?: string) => {
  return await PromoService.listSections(q);
});

export const createPromoSection = createAsyncThunk(
  'promo/sections/create',
  async (dto: CreatePromoSectionDto) => {
    return await PromoService.createSection(dto);
  },
);
export const updatePromoSection = createAsyncThunk(
  'promo/sections/update',
  async (p: { id: number; dto: UpdatePromoSectionDto }) => {
    return await PromoService.updateSection(p.id, p.dto);
  },
);
export const deletePromoSection = createAsyncThunk('promo/sections/delete', async (id: number) => {
  await PromoService.deleteSection(id);
  return id;
});

export const listPlacements = createAsyncThunk(
  'promo/placements/list',
  async (params?: { pageType?: string; entityId?: string }) => {
    return await PromoService.listPlacements(params);
  },
);

export const createPlacement = createAsyncThunk('promo/placements/create', async (dto: any) => {
  return await PromoService.createPlacement(dto);
});

export const updatePlacement = createAsyncThunk(
  'promo/placements/update',
  async (p: { id: number; dto: any }) => {
    return await PromoService.updatePlacement(p.id, p.dto);
  },
);

export const deletePlacement = createAsyncThunk('promo/placements/delete', async (id: number) => {
  await PromoService.deletePlacement(id);
  return id;
});

export const reorderPlacements = createAsyncThunk(
  'promo/placements/reorder',
  async (payload: { key: string; items: { id: number; order: number }[] }) => {
    await PromoService.reorderPlacements(payload.items);
    return payload;
  },
);

// Дублирование секции локально (берём объект как есть, чистим ID/даты) и создаём новую
export const duplicatePromoSection = createAsyncThunk(
  'promo/duplicatePromoSection',
  async (source: PromoSection, { rejectWithValue }) => {
    try {
      // соберём dto для создания
      const { id, createdAt, updatedAt, placements, ...rest } = source;

      const dto: CreatePromoSectionDto = {
        ...rest,
        title: source.title ? `${source.title} (копия)` : undefined,
        isActive: true,
      };

      // создаём новую секцию
      const created = await PromoService.createSection(dto);
      return created; // вернём для редьюсера
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error?.message || 'Не удалось дублировать секцию');
      }
    }
  },
);
