import { createSlice } from '@reduxjs/toolkit';
import {
  createCategoryPromoSection,
  deleteCategoryPromoSection,
  fetchAllCategoryPromoSections,
  updateCategoryPromoSection,
  fetchCategoryPromoSectionsBySlug,
} from './category-promo-sections.thunks';
import {
  CategoryPromoPlacement,
  CategoryPromoSection,
  CategoryPromoSectionAdmin,
} from '@/types/models/category-promo-section.model';

export type PlacementMap = Partial<Record<CategoryPromoPlacement, CategoryPromoSectionAdmin[]>>;

interface CategoryPromoSectionsState {
  items: CategoryPromoSectionAdmin[];
  byPlacement: PlacementMap;
  bySlug: Record<string, CategoryPromoSection[]>;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
}

const initialState: CategoryPromoSectionsState = {
  items: [],
  byPlacement: {},
  bySlug: {},
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
};

const groupByPlacement = (items: CategoryPromoSectionAdmin[]): PlacementMap => {
  const map: PlacementMap = {};
  items.forEach(item => {
    const key = item.placement;
    map[key] = map[key] || [];
    map[key]!.push(item);
  });
  (Object.keys(map) as CategoryPromoPlacement[]).forEach(key => {
    map[key] = map[key]!.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
  });
  return map;
};

const slice = createSlice({
  name: 'categoryPromoSections',
  initialState,
  reducers: {
    setOrderForPlacement(
      state,
      action: { payload: { placement: CategoryPromoPlacement; ids: number[] } },
    ) {
      const { placement, ids } = action.payload;

      const list = state.byPlacement[placement] ? [...state.byPlacement[placement]!] : [];

      // Быстрый выход: если пусто
      if (!list.length || !ids.length) {
        state.byPlacement[placement] = list;
        return;
      }

      // индекс позиции по id
      const pos: Record<number, number> = {};
      ids.forEach((id, idx) => {
        pos[id] = idx + 1;
      });

      // пересобираем список по new ids, но не теряем элементы (на всякий)
      const next = list
        .slice()
        .sort((a, b) => {
          const pa = pos[a.id] ?? a.order ?? 0;
          const pb = pos[b.id] ?? b.order ?? 0;
          return pa - pb;
        })
        .map(item => {
          const newOrder = pos[item.id];
          if (newOrder) item.order = newOrder; // immer
          item.placement = placement;
          return item;
        });

      // синхронизуем на всякий случай: если вдруг появились id, которых не было в list
      const knownIds = new Set(next.map(i => i.id));
      ids.forEach((id, idx) => {
        if (!knownIds.has(id) && (state as any).entities?.[id]) {
          const ent = (state as any).entities[id];
          ent.order = idx + 1;
          ent.placement = placement;
          next.push(ent);
        }
      });

      state.byPlacement[placement] = next;
    },
    moveItemToPlacement(
      state,
      action: {
        payload: {
          id: number;
          from: CategoryPromoPlacement;
          to: CategoryPromoPlacement;
          index?: number;
        };
      },
    ) {
      const { id, from, to, index } = action.payload;
      const fromList = state.byPlacement[from] ? [...state.byPlacement[from]!] : [];
      const toList = state.byPlacement[to] ? [...state.byPlacement[to]!] : [];
      const itemIndex = fromList.findIndex(i => i.id === id);
      if (itemIndex === -1) return;
      const [item] = fromList.splice(itemIndex, 1);
      const newItem = { ...item, placement: to } as CategoryPromoSectionAdmin;
      if (typeof index === 'number' && index >= 0 && index <= toList.length) {
        toList.splice(index, 0, newItem);
      } else {
        toList.push(newItem);
      }
      // перенумеруем order без создания новых объектов
      fromList.forEach((i, idx) => {
        i.order = idx + 1;
      });
      toList.forEach((i, idx) => {
        i.order = idx + 1;
      });
      state.byPlacement[from] = fromList;
      state.byPlacement[to] = toList;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllCategoryPromoSections.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategoryPromoSections.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload;
        state.byPlacement = groupByPlacement(payload);
      })
      .addCase(fetchAllCategoryPromoSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCategoryPromoSection.pending, state => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createCategoryPromoSection.fulfilled, (state, { payload }) => {
        state.creating = false;
        state.items.push(payload as any);
        // Rebuild groups quickly
        state.byPlacement = groupByPlacement(state.items);
      })
      .addCase(createCategoryPromoSection.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      })
      .addCase(updateCategoryPromoSection.pending, state => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateCategoryPromoSection.fulfilled, (state, { payload }) => {
        state.updating = false;
        const idx = state.items.findIndex(i => i.id === payload.id);
        if (idx !== -1) state.items[idx] = payload as any;
        state.byPlacement = groupByPlacement(state.items);
      })
      .addCase(updateCategoryPromoSection.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCategoryPromoSection.pending, state => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteCategoryPromoSection.fulfilled, (state, { payload }) => {
        state.deleting = false;
        state.items = state.items.filter(i => i.id !== payload);
        state.byPlacement = groupByPlacement(state.items);
      })
      .addCase(deleteCategoryPromoSection.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string;
      })
      // Публичные секции по slug
      .addCase(fetchCategoryPromoSectionsBySlug.fulfilled, (state, { payload }) => {
        state.bySlug[payload.slug] = payload.items as any;
      });
  },
});

export const { setOrderForPlacement, moveItemToPlacement } = slice.actions;
export default slice.reducer;
