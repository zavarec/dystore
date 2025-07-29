import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  fetchProducts,
  fetchProductById,
  fetchProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchProductsByCategoryIncludingDescendants,
} from './products.thunks';
import { Product } from '@/types/models/product.model';
import { ProductsState } from './products.types';

const initialState: ProductsState = {
  items: [],
  currentProduct: null,
  categoryProducts: [],
  categoryProductsIncludingDescendants: [],
  categoryProductsIncludingDescendantsLoading: false,

  searchQuery: '',
  totalItems: 0,
  currentPage: 1,
  itemsPerPage: 12,
  isLoading: false,
  error: null,
  categoryLoading: false,
  categoryError: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearCurrentProduct: state => {
      state.currentProduct = null;
    },
    clearError: state => {
      state.error = null;
    },
    clearCategoryProducts: state => {
      state.categoryProducts = [];
      state.categoryError = null;
    },
    clearCategoryError: state => {
      state.categoryError = null;
    },
  },
  extraReducers: builder => {
    builder
      // Получение всех продуктов
      .addCase(fetchProducts.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.totalItems = action.payload.length;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Получение продукта по ID
      .addCase(fetchProductById.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Получение продуктов по категории
      .addCase(fetchProductsByCategory.pending, state => {
        state.categoryLoading = true;
        state.categoryError = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.categoryProducts = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.categoryLoading = false;
        state.categoryError = action.payload as string;
      })

      // Получение продуктов по категории с подкатегориями
      .addCase(fetchProductsByCategoryIncludingDescendants.pending, state => {
        state.categoryProductsIncludingDescendantsLoading = true;
      })
      .addCase(fetchProductsByCategoryIncludingDescendants.fulfilled, (state, action) => {
        state.categoryProductsIncludingDescendantsLoading = false;
        state.categoryProductsIncludingDescendants = action.payload;
      })
      .addCase(fetchProductsByCategoryIncludingDescendants.rejected, state => {
        state.categoryProductsIncludingDescendantsLoading = false;
      })
      // Создание продукта
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.totalItems = state.items.length;
      })
      // Обновление продукта
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((item: Product) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      // Удаление продукта
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item: Product) => item.id !== action.payload);
        state.totalItems = state.items.length;
        if (state.currentProduct?.id === action.payload) {
          state.currentProduct = null;
        }
      });
  },
});

export const {
  setSearchQuery,
  setCurrentPage,
  clearCurrentProduct,
  clearError,
  clearCategoryProducts,
  clearCategoryError,
} = productsSlice.actions;

export default productsSlice.reducer;
