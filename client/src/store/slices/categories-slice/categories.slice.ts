import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchRootCategories,
} from './categories.thunks';

import { CategoriesState } from './categories.types';

const initialState: CategoriesState = {
  categories: [],
  rootCategories: [],
  // subCategories: [],
  currentCategory: null,

  isRootCategoriesLoading: false,

  isLoading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCurrentCategory: state => {
      state.currentCategory = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Получение всех категорий
      .addCase(fetchCategories.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Получение категории по ID
      .addCase(fetchCategoryById.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Получение всех родительских категорий
      .addCase(fetchRootCategories.pending, state => {
        state.isRootCategoriesLoading = true;
      })
      .addCase(fetchRootCategories.fulfilled, (state, action) => {
        state.isRootCategoriesLoading = false;
        state.rootCategories = action.payload;
      })
      .addCase(fetchRootCategories.rejected, state => {
        state.isRootCategoriesLoading = false;
      })

      // Создание категории
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })

      // Обновление категории
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.currentCategory?.id === action.payload.id) {
          state.currentCategory = action.payload;
        }
      })

      // Удаление категории
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(item => item.id !== action.payload);
        if (state.currentCategory?.id === action.payload) {
          state.currentCategory = null;
        }
      });
  },
});

export const { clearCurrentCategory, clearError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
