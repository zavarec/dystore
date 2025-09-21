import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProductsService } from '@/services';
import { SpecAttributesService } from '@/services/spec-attributes.service';
import type { CreateSpecAttributeDto } from '@/services/spec-attributes.service';
import { CreateProductDto, UpdateProductDto } from '@/types/models/product.model';

// Получить все продукты
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await ProductsService.getAllProducts();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки продуктов');
    }
  },
);

// Получить продукт по ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await ProductsService.getProductById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Продукт не найден');
    }
  },
);

// Получить продукты по категории
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (categoryId: number, { rejectWithValue }) => {
    try {
      return await ProductsService.getProductsByCategory(categoryId);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка загрузки продуктов категории',
      );
    }
  },
);

// Создать продукт
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (data: CreateProductDto, { rejectWithValue }) => {
    try {
      return await ProductsService.createProduct(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка создания продукта');
    }
  },
);

// Обновить продукт
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }: { id: number; data: UpdateProductDto }, { rejectWithValue }) => {
    try {
      return await ProductsService.updateProduct(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления продукта');
    }
  },
);

// Получить продукты по категории с подкатегориями
export const fetchProductsByCategoryIncludingDescendants = createAsyncThunk(
  'products/fetchProductsByCategoryIncludingDescendants',
  async (categoryId: number, { rejectWithValue }) => {
    try {
      return await ProductsService.getProductsByCategoryIncludingDescendants(categoryId);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка загрузки продуктов категории с подкатегориями',
      );
    }
  },
);

// Удалить продукт
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: number, { rejectWithValue }) => {
    try {
      await ProductsService.deleteProduct(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления продукта');
    }
  },
);

// Получить все атрибуты характеристик
export const fetchSpecAttributes = createAsyncThunk(
  'products/fetchSpecAttributes',
  async (q: string | undefined, { rejectWithValue }) => {
    try {
      return await SpecAttributesService.list(q);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки атрибутов');
    }
  },
);

// Создать атрибут характеристики
export const createSpecAttribute = createAsyncThunk(
  'products/createSpecAttribute',
  async (dto: CreateSpecAttributeDto, { rejectWithValue }) => {
    try {
      return await SpecAttributesService.create(dto);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка создания атрибута');
    }
  },
);
