import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';

export const selectPlacementsByPageKey = (pageType: string, entityId: string) =>
  createSelector(
    (s: RootState) => s.sectionsWithPlacementsSlice,
    state => {
      const key = `${pageType}:${entityId}`;
      const ids = state.byPlacementPage[key] || [];
      const items = ids.map(id => state.byPlacementId[id]).filter(Boolean);
      // сгруппируем по slot
      const bySlot: Record<string, typeof items> = {};
      items.forEach(p => {
        (bySlot[p.slot] ||= []).push(p);
      });
      // внутри слота — по order
      Object.values(bySlot).forEach(list => list.sort((a, b) => a.order - b.order));
      return bySlot;
    },
  );

export const selectPromoPlacements = (state: RootState) =>
  state.sectionsWithPlacementsSlice.promoPlacements;

export const selectPromoSections = (state: RootState) =>
  state.sectionsWithPlacementsSlice.allSections;
