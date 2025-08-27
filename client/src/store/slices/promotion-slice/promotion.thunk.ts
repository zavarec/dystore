import { PromotionsService } from '@/services/promotion.service';
import { LayoutService, PageSectionDTO } from '@/services/layout.service';
import { Promotion, PromotionSlot } from '@/types/models/promotion.model';
import { createAsyncThunk } from '@reduxjs/toolkit';

// 🔹 Получить активные промо по слоту
export const fetchActivePromosBySlot = createAsyncThunk<
  Promotion[] | Promotion | null,
  PromotionSlot
>('promotions/fetchActiveBySlot', async (slot, thunkAPI) => {
  try {
    return await PromotionsService.getActiveBySlot(slot);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// 🔹 Добавить новое промо
export const createPromotion = createAsyncThunk<Promotion, Partial<Promotion>>(
  'promotions/create',
  async (dto, thunkAPI) => {
    try {
      return await PromotionsService.createPromotion(dto);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// 🔹 Обновить промо
export const updatePromotion = createAsyncThunk<Promotion, { id: number; dto: Partial<Promotion> }>(
  'promotions/update',
  async ({ id, dto }, thunkAPI) => {
    try {
      return await PromotionsService.updatePromotion(id, dto);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// 🔹 Удалить промо
export const deletePromotion = createAsyncThunk<number, number>(
  'promotions/delete',
  async (id, thunkAPI) => {
    try {
      await PromotionsService.removePromotion(id);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// 🔹 Загрузить секции главной страницы (layout)
export const fetchHomeLayoutSections = createAsyncThunk<PageSectionDTO[], void>(
  'promotions/fetchHomeLayoutSections',
  async (_, thunkAPI) => {
    try {
      return await LayoutService.getHome();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);
