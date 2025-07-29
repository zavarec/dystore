import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductCategory } from '@/types/models/product.model';

interface FiltersState {
  isOpen: boolean;
  activeCategory: ProductCategory | null;
  priceRange: {
    min: number;
    max: number;
    currentMin: number;
    currentMax: number;
  };
  availableFilters: {
    categories: { value: ProductCategory; label: string; count: number }[];
    priceRange: { min: number; max: number };
    brands: { value: string; label: string; count: number }[];
    features: { value: string; label: string; count: number }[];
  };
}

const initialState: FiltersState = {
  isOpen: false,
  activeCategory: null,
  priceRange: {
    min: 0,
    max: 100000,
    currentMin: 0,
    currentMax: 100000,
  },
  availableFilters: {
    categories: [
      { value: ProductCategory.VACUUM_CLEANERS, label: 'Пылесосы', count: 0 },
      { value: ProductCategory.HAIR_CARE, label: 'Уход за волосами', count: 0 },
      {
        value: ProductCategory.AIR_PURIFIERS,
        label: 'Очистители воздуха',
        count: 0,
      },
      { value: ProductCategory.LIGHTING, label: 'Освещение', count: 0 },
      { value: ProductCategory.FANS, label: 'Вентиляторы', count: 0 },
      { value: ProductCategory.ACCESSORIES, label: 'Аксессуары', count: 0 },
    ],
    priceRange: { min: 0, max: 100000 },
    brands: [],
    features: [],
  },
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    toggleFilters: state => {
      state.isOpen = !state.isOpen;
    },
    setFiltersOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setActiveCategory: (state, action: PayloadAction<ProductCategory | null>) => {
      state.activeCategory = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
      state.priceRange.currentMin = action.payload.min;
      state.priceRange.currentMax = action.payload.max;
    },
    resetPriceRange: state => {
      state.priceRange.currentMin = state.priceRange.min;
      state.priceRange.currentMax = state.priceRange.max;
    },
    updateAvailableFilters: (state, action: PayloadAction<FiltersState['availableFilters']>) => {
      state.availableFilters = action.payload;
    },
    resetFilters: state => {
      state.activeCategory = null;
      state.priceRange.currentMin = state.priceRange.min;
      state.priceRange.currentMax = state.priceRange.max;
    },
  },
});

export const {
  toggleFilters,
  setFiltersOpen,
  setActiveCategory,
  setPriceRange,
  resetPriceRange,
  updateAvailableFilters,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
