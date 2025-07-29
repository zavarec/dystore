import { createAsyncThunk } from '@reduxjs/toolkit';
import { CategoriesService } from '@/services';
import { CreateCategoryDto, UpdateCategoryDto } from '@/types/models/category.model';

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await CategoriesService.getAllCategories();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки категорий');
    }
  },
);

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await CategoriesService.getCategoryById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Категория не найдена');
    }
  },
);

export const fetchRootCategories = createAsyncThunk(
  'categories/fetchRootCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await CategoriesService.getRootCategories();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки категорий');
    }
  },
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (data: CreateCategoryDto, { rejectWithValue }) => {
    try {
      return await CategoriesService.createCategory(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка создания категории');
    }
  },
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, data }: { id: number; data: UpdateCategoryDto }, { rejectWithValue }) => {
    try {
      return await CategoriesService.updateCategory(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления категории');
    }
  },
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await CategoriesService.deleteCategory(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления категории');
    }
  },
);
