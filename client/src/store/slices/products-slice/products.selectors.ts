import { RootState } from '@/store';

// Базовые селекторы продуктов
export const selectProducts = (state: RootState) => state.productsSlice.items;
export const selectProductsLoading = (state: RootState) => state.productsSlice.isLoading;
export const selectProductsError = (state: RootState) => state.productsSlice.error;
export const selectCurrentProduct = (state: RootState) => state.productsSlice.currentProduct;

// Селекторы для продуктов категории
export const selectCategoryProducts = (state: RootState) => state.productsSlice.categoryProducts;
export const selectCategoryProductsLoading = (state: RootState) =>
  state.productsSlice.categoryLoading;
export const selectCategoryProductsError = (state: RootState) => state.productsSlice.categoryError;
export const selectCategoryProductsIncludingDescendants = (state: RootState) =>
  state.productsSlice.categoryProductsIncludingDescendants;
export const selectCategoryProductsIncludingDescendantsLoading = (state: RootState) =>
  state.productsSlice.categoryProductsIncludingDescendantsLoading;

// Селекторы пагинации и поиска
export const selectSearchQuery = (state: RootState) => state.productsSlice.searchQuery;
export const selectCurrentPage = (state: RootState) => state.productsSlice.currentPage;
export const selectItemsPerPage = (state: RootState) => state.productsSlice.itemsPerPage;
export const selectTotalItems = (state: RootState) => state.productsSlice.totalItems;

// Селекторы атрибутов характеристик
export const selectSpecAttributes = (state: RootState) => state.productsSlice.specAttributes;
