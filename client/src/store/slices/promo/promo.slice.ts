import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  createPlacement,
  createPromoSection,
  deletePlacement,
  deletePromoSection,
  duplicatePromoSection,
  listPlacements,
  listPromoSections,
  reorderPlacements,
  updatePlacement,
  updatePromoSection,
} from './promo.thunks';
import { PromoPlacement } from '@/types/models/promo-placement.model';
import { PromoSection } from '@/types/models/promo-section.model';

type SectionsWithPlacementsState = {
  allSections: PromoSection[];
  bySectionId: Record<number, any>;
  allSectionIds: number[];
  sectionsLoading: boolean;
  sectionsError?: string | null;

  promoPlacements: PromoPlacement[];
  byPlacementId: Record<number, any>;
  allPlacementIds: number[];
  placementsLoading: boolean;
  placementsError?: string | null;

  // индексы по (pageType, entityId)
  byPlacementPage: Record<string, number[]>; // key = `${pageType}:${entityId}`
  pendingReorder?: { key: string; items: { id: number; order: number }[] } | null;
  // буфер для оптимистичного reorder
};

const initialState: SectionsWithPlacementsState = {
  allSections: [],
  bySectionId: {},
  allSectionIds: [],
  sectionsLoading: false,
  sectionsError: null,

  promoPlacements: [],
  byPlacementId: {},
  allPlacementIds: [],
  placementsLoading: false,
  placementsError: null,

  byPlacementPage: {},
  pendingReorder: null,
};

const sectionsWithPlacementsSlice = createSlice({
  name: 'promoSections',
  initialState,
  reducers: {
    // локальный оптимистичный reorder
    applyLocalReorder(state, action: PayloadAction<{ key: string; idsOrdered: number[] }>) {
      const { key, idsOrdered } = action.payload;
      state.byPlacementPage[key] = idsOrdered;
      idsOrdered.forEach((id, idx) => {
        if (state.byPlacementId[id]) state.byPlacementId[id].order = idx;
      });
    },
  },
  extraReducers: builder => {
    builder
      .addCase(listPromoSections.pending, state => {
        state.sectionsLoading = true;
        state.sectionsError = null;
      })
      .addCase(listPromoSections.fulfilled, (state, { payload }: PayloadAction<any[]>) => {
        state.sectionsLoading = false;
        state.bySectionId = {};
        state.allSectionIds = [];
        state.allSections = payload;
        payload.forEach(item => {
          state.bySectionId[item.id] = item;
          state.allSectionIds.push(item.id);
        });
      })
      .addCase(listPromoSections.rejected, (state, action) => {
        state.sectionsLoading = false;
        state.sectionsError = String(action.error.message || 'Failed');
      })
      .addCase(createPromoSection.fulfilled, (state, { payload }: PayloadAction<any>) => {
        const { id } = payload;
        state.bySectionId[id] = payload;

        console.log(payload, 'payload');

        if (!state.allSectionIds.includes(id)) state.allSectionIds.unshift(id);
      })

      .addCase(updatePromoSection.fulfilled, (state, a: PayloadAction<any>) => {
        state.bySectionId[a.payload.id] = a.payload;
      })

      .addCase(deletePromoSection.fulfilled, (s, a: PayloadAction<number>) => {
        delete s.bySectionId[a.payload];
        s.allSectionIds = s.allSectionIds.filter(id => id !== a.payload);
      })

      // placements
      .addCase(listPlacements.pending, s => {
        s.placementsLoading = true;
        s.placementsError = null;
      })
      .addCase(listPlacements.fulfilled, (state, action) => {
        state.placementsLoading = false;
        state.promoPlacements = action.payload as PromoPlacement[];

        (action.payload as PromoPlacement[]).forEach(p => {
          state.byPlacementId[p.id] = p;
          if (!state.allPlacementIds.includes(p.id)) state.allPlacementIds.push(p.id);
        });
        // если пришёл фильтр по pageType+entityId — построим ключ
        const sample = (action as any).meta?.arg as { pageType?: string; entityId?: string };
        if (sample?.pageType && sample?.entityId) {
          const key = `${sample.pageType}:${sample.entityId}`;
          state.byPlacementPage[key] = (action.payload as PromoPlacement[])
            .sort((x, y) => x.slot.localeCompare(y.slot) || x.order - y.order || x.id - y.id)
            .map(p => p.id);
        }
      })

      .addCase(listPlacements.rejected, (s, a) => {
        s.placementsLoading = false;
        s.placementsError = String(a.error.message || 'Failed');
      })

      .addCase(createPlacement.fulfilled, (state, { payload }) => {
        const p = payload as PromoPlacement;
        state.byPlacementId[p.id] = p;
        if (!state.allPlacementIds.includes(p.id)) state.allPlacementIds.push(p.id);
        const key = `${p.pageType}:${p.entityId}`;
        state.byPlacementPage[key] = (state.byPlacementPage[key] || []).concat(p.id);
      })

      .addCase(updatePlacement.fulfilled, (state, { payload }) => {
        const { id, entityId, pageType } = payload as PromoPlacement;
        state.byPlacementId[id] = payload;
        const key = `${pageType}:${entityId}`;
        if (state.byPlacementPage[key] && !state.byPlacementPage[key].includes(id))
          state.byPlacementPage[key].push(id);
      })

      .addCase(deletePlacement.fulfilled, (state, { payload }: PayloadAction<number>) => {
        const id = payload;
        const existing = state.byPlacementId[id];
        delete state.byPlacementId[id];
        state.allPlacementIds = state.allPlacementIds.filter(x => x !== id);
        if (existing) {
          const key = `${existing.pageType}:${existing.entityId}`;
          state.byPlacementPage[key] = (state.byPlacementPage[key] || []).filter(x => x !== id);
        }
      })

      .addCase(reorderPlacements.pending, (state, action) => {
        state.pendingReorder = action.meta.arg;
      })
      .addCase(reorderPlacements.fulfilled, (state, action) => {
        state.pendingReorder = null;
        const { key } = action.payload!;
        // orders уже проставлены локально, но подстрахуемся
        const orderedIds = (state.byPlacementPage[key] || [])
          .slice()
          .sort(
            (id1, id2) =>
              (state.byPlacementId[id1]?.order ?? 0) - (state.byPlacementId[id2]?.order ?? 0),
          );
        state.byPlacementPage[key] = orderedIds;
      })
      .addCase(reorderPlacements.rejected, s => {
        // можно откатить, если сохраняли снапшот
        s.pendingReorder = null;
      })

      // duplicatePromoSection
      .addCase(duplicatePromoSection.fulfilled, (state, { payload }) => {
        const created = payload;
        if (!created) return;

        // у тебя уже есть normalizer: bySectionId + allSectionIds
        state.bySectionId[created.id] = created;
        if (!state.allSectionIds.includes(created.id)) {
          state.allSectionIds.push(created.id);
        }
      });
  },
});

export const { applyLocalReorder } = sectionsWithPlacementsSlice.actions;

export default sectionsWithPlacementsSlice.reducer;
