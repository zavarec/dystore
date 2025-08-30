import { RootState } from '@/store';
import { CategoryPromoPlacement } from '@/types/models/category-promo-section.model';
import { createSelector } from '@reduxjs/toolkit';

export const selectCategoryPromoSectionsState = (state: RootState) =>
  state.categoryPromoSectionsSlice;

export const selectCategoryPromoSectionsAll = (state: RootState) =>
  selectCategoryPromoSectionsState(state).items;

export const selectCategoryPromoSectionsByPlacement = (state: RootState) =>
  selectCategoryPromoSectionsState(state).byPlacement;

export const selectCategoryPromoSectionsLoading = (state: RootState) =>
  selectCategoryPromoSectionsState(state).loading;

export const selectCategoryPromoSectionsError = (state: RootState) =>
  selectCategoryPromoSectionsState(state).error;

export const makeSelectCategoryPromoSectionsForPlacement = (placement: CategoryPromoPlacement) =>
  createSelector(selectCategoryPromoSectionsByPlacement, m => m[placement] || []);

export const makeSelectCategoryPromoSectionsBySlug = (slug: string) =>
  createSelector(selectCategoryPromoSectionsState, state => state.bySlug[slug] || []);
