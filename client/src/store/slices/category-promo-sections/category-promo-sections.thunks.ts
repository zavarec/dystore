import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  CategoryPromoSectionsService,
  CreateCategoryPromoSectionDto,
  UpdateCategoryPromoSectionDto,
} from '@/services/category-promo-sections.service';
import {
  CategoryPromoSection,
  CategoryPromoSectionAdmin,
} from '@/types/models/category-promo-section.model';

export const fetchAllCategoryPromoSections = createAsyncThunk<CategoryPromoSectionAdmin[], void>(
  'categoryPromoSections/fetchAll',
  async (_, thunkAPI) => {
    try {
      return await CategoryPromoSectionsService.adminList();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

export const createCategoryPromoSection = createAsyncThunk<
  CategoryPromoSection,
  CreateCategoryPromoSectionDto
>('categoryPromoSections/create', async (dto, thunkAPI) => {
  try {
    return await CategoryPromoSectionsService.create(dto);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const updateCategoryPromoSection = createAsyncThunk<
  CategoryPromoSection,
  { id: number; dto: UpdateCategoryPromoSectionDto }
>('categoryPromoSections/update', async ({ id, dto }, thunkAPI) => {
  try {
    return await CategoryPromoSectionsService.update(id, dto);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const deleteCategoryPromoSection = createAsyncThunk<number, number>(
  'categoryPromoSections/delete',
  async (id, thunkAPI) => {
    try {
      await CategoryPromoSectionsService.remove(id);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// Публично: получить промо-секции категории по slug
export const fetchCategoryPromoSectionsBySlug = createAsyncThunk<
  { slug: string; items: CategoryPromoSection[] },
  string
>('categoryPromoSections/fetchBySlug', async (slug, thunkAPI) => {
  try {
    const items = await CategoryPromoSectionsService.publicByCategorySlug(slug);
    return { slug, items };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});
