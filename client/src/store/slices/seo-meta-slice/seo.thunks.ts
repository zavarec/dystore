import { createAsyncThunk } from '@reduxjs/toolkit';
import { SeoMetaService } from '@/services/seo-meta.service';
import { SeoMeta, SeoPageType, UpsertSeoMetaRequest } from '@/types/models/seo-meta.model';

export const listSeoMeta = createAsyncThunk(
  'seo/list',
  async (
    params: { pageType?: SeoPageType; entityId?: string; locale?: string } | undefined,
    { rejectWithValue },
  ) => {
    try {
      return await SeoMetaService.list(params);
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Ошибка загрузки SEO мета');
    }
  },
);

export const getSeoMeta = createAsyncThunk(
  'seo/getOne',
  async (
    { pageType, entityId, locale }: { pageType: SeoPageType; entityId: string; locale?: string },
    { rejectWithValue },
  ) => {
    try {
      return await SeoMetaService.getOne(pageType, entityId, locale);
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'SEO мета не найдена');
    }
  },
);

export const upsertSeoMeta = createAsyncThunk(
  'seo/upsert',
  async (payload: UpsertSeoMetaRequest, { rejectWithValue }) => {
    try {
      return await SeoMetaService.upsert(payload);
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Ошибка сохранения SEO мета');
    }
  },
);

export const deleteSeoMeta = createAsyncThunk(
  'seo/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await SeoMetaService.remove(id);
      return id;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Ошибка удаления SEO мета');
    }
  },
);
