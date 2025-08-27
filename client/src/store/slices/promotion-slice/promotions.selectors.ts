import { RootState } from '@/store';
import { PromotionSlot } from '@/types/models/promotion.model';
import { createSelector } from '@reduxjs/toolkit';

export const selectPromotions = (state: RootState) => state.promotionsSlice.promotions;
export const selectHomeSections = (state: RootState) => state.promotionsSlice.homeSections;

export const selectPromotionsLoading = (state: RootState) =>
  state.promotionsSlice.getPromotionsLoading;

export const selectCreatePromotionLoading = (state: RootState) =>
  state.promotionsSlice.createPromotionLoading;

export const selectDeletePromotionLoading = (state: RootState) =>
  state.promotionsSlice.deletePromotionLoading;

export const selectUpdatePromotionLoading = (state: RootState) =>
  state.promotionsSlice.updatePromotionLoading;

export const selectPromotionsError = (state: RootState) => state.promotionsSlice.error;

export const selectPromotionsBySlot = (slot: PromotionSlot) =>
  createSelector(selectPromotions, promotions => promotions[slot]);

export const selectProductOfDay = createSelector(
  selectPromotions,
  promotions => promotions[PromotionSlot.PRODUCT_OF_DAY]?.[0] ?? null,
);

export const selectPromotionById = (id: number) =>
  createSelector(selectPromotions, promotions => {
    const all = Object.values(promotions).flat();
    return all.find(p => p.id === id) ?? null;
  });
