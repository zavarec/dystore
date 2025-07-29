import { RootState } from '@/store';

export const selectCategories = (state: RootState) => state.categoriesSlice.categories;
export const selectCurrentCategory = (state: RootState) => state.categoriesSlice.currentCategory;
export const selectCategoriesLoading = (state: RootState) => state.categoriesSlice.isLoading;
export const selectCategoriesError = (state: RootState) => state.categoriesSlice.error;

export const selectRootCategories = (state: RootState) => state.categoriesSlice.rootCategories;

export const selectIsRootCategoriesLoading = (state: RootState) =>
  state.categoriesSlice.isRootCategoriesLoading;
