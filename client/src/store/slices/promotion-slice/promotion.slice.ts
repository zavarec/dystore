// src/store/slices/promotions-slice.ts
import { createSlice } from '@reduxjs/toolkit';

import {
  createPromotion,
  deletePromotion,
  fetchActivePromosBySlot,
  fetchHomeLayoutSections,
  updatePromotion,
} from './promotion.thunk';
import { Promotion, PromotionSlot } from '@/types/models/promotion.model';
import { PageSectionDTO } from '@/services/layout.service';

interface PromotionsState {
  promotions: Record<PromotionSlot, Promotion[]>;
  homeSections: PageSectionDTO[];
  getPromotionsLoading: boolean;
  // Флаг, чтобы не дублировать запросы по слотам (React StrictMode в dev)
  requestedSlots: Record<PromotionSlot, boolean>;
  createPromotionLoading: boolean;
  updatePromotionLoading: boolean;
  deletePromotionLoading: boolean;
  error: string | null;
}

const initialState: PromotionsState = {
  promotions: { HERO: [], PRODUCT_OF_DAY: [], FEATURED: [], CUSTOM: [] },
  homeSections: [],

  getPromotionsLoading: false,
  requestedSlots: { HERO: false, PRODUCT_OF_DAY: false, FEATURED: false, CUSTOM: false },
  createPromotionLoading: false,
  updatePromotionLoading: false,
  deletePromotionLoading: false,

  error: null,
};

const promotionsSlice = createSlice({
  name: 'promotions',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // 🔹 Получить активные промо по слоту
      .addCase(fetchActivePromosBySlot.pending, (state, action) => {
        state.getPromotionsLoading = true;
        const slot = action.meta.arg as PromotionSlot;
        state.requestedSlots[slot] = true;
        state.error = null;
      })
      .addCase(fetchActivePromosBySlot.fulfilled, (state, action) => {
        state.getPromotionsLoading = false;
        const slot = action.meta.arg;
        if (slot === 'PRODUCT_OF_DAY') {
          state.promotions[slot] = action.payload ? [action.payload as Promotion] : [];
        } else {
          state.promotions[slot] = (action.payload as Promotion[]) ?? [];
        }
        state.requestedSlots[slot] = false;
      })
      .addCase(fetchActivePromosBySlot.rejected, (state, action) => {
        state.getPromotionsLoading = false;
        const slot = action.meta?.arg as PromotionSlot;
        if (slot) state.requestedSlots[slot] = false;
        state.error = action.payload as string;
      })

      // 🔹 Добавить новое промо
      .addCase(createPromotion.pending, state => {
        state.createPromotionLoading = true;
      })
      .addCase(createPromotion.fulfilled, (state, { payload }) => {
        const slot = payload.slot;
        state.promotions[slot].push(payload);
        state.createPromotionLoading = false;
      })
      .addCase(createPromotion.rejected, (state, action) => {
        state.createPromotionLoading = false;
        state.error = action.payload as string;
      })

      // 🔹 Обновить промо
      .addCase(updatePromotion.pending, state => {
        state.updatePromotionLoading = true;
        state.error = null;
      })
      .addCase(updatePromotion.fulfilled, (state, { payload }) => {
        const updated = payload;
        // Удаляем промо из всех слотов, если присутствует
        (Object.keys(state.promotions) as PromotionSlot[]).forEach(slot => {
          state.promotions[slot] = state.promotions[slot].filter(p => p.id !== updated.id);
        });
        // Добавляем в его (возможно новый) слот
        state.promotions[updated.slot] = [...(state.promotions[updated.slot] || []), updated];
        // Опционально: сортируем по position
        state.promotions[updated.slot].sort((a, b) => (a.position || 0) - (b.position || 0));
        state.updatePromotionLoading = false;
      })
      .addCase(updatePromotion.rejected, (state, action) => {
        state.updatePromotionLoading = false;
        state.error = action.payload as string;
      })

      // 🔹 Удалить промо
      .addCase(deletePromotion.pending, state => {
        state.deletePromotionLoading = true;
      })
      .addCase(deletePromotion.fulfilled, (state, { payload }) => {
        (Object.keys(state.promotions) as PromotionSlot[]).forEach(slot => {
          state.promotions[slot] = state.promotions[slot].filter(p => p.id !== payload);
        });
      })
      .addCase(deletePromotion.rejected, (state, action) => {
        state.deletePromotionLoading = false;
        state.error = action.payload as string;
      })

      // 🔹 Загрузить секции главной страницы
      .addCase(fetchHomeLayoutSections.pending, state => {
        // используем общий error флаг
        state.error = null;
      })
      .addCase(fetchHomeLayoutSections.fulfilled, (state, { payload }) => {
        state.homeSections = payload;
      })
      .addCase(fetchHomeLayoutSections.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default promotionsSlice.reducer;
