import { createSlice } from '@reduxjs/toolkit';
import { SeoMeta } from '@/types/models/seo-meta.model';
import { deleteSeoMeta, getSeoMeta, listSeoMeta, upsertSeoMeta } from './seo.thunks';
import { LoadingState } from '@/types/common';

interface SeoState extends LoadingState {
  items: SeoMeta[];
  current: SeoMeta | null;
}

const initialState: SeoState = {
  items: [],
  current: null,
  isLoading: false,
  error: null,
};

const seoSlice = createSlice({
  name: 'seo',
  initialState,
  reducers: {
    clearSeoError: state => {
      state.error = null;
    },
    resetCurrentSeo: state => {
      state.current = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(listSeoMeta.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(listSeoMeta.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.items = payload as SeoMeta[];
      })
      .addCase(listSeoMeta.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      })

      .addCase(getSeoMeta.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSeoMeta.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.current = payload as SeoMeta;
      })
      .addCase(getSeoMeta.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      })

      .addCase(upsertSeoMeta.fulfilled, (state, { payload }) => {
        const meta = payload as SeoMeta;
        state.current = meta;
        const idx = state.items.findIndex(
          i =>
            i.pageType === meta.pageType &&
            i.entityId === meta.entityId &&
            i.locale === meta.locale,
        );
        if (idx >= 0) state.items[idx] = meta;
        else state.items.unshift(meta);
      })

      .addCase(deleteSeoMeta.fulfilled, (state, { payload }) => {
        const id = payload as number;
        state.items = state.items.filter(i => i.id !== id);
        if (state.current?.id === id) state.current = null;
      });
  },
});

export const { clearSeoError, resetCurrentSeo } = seoSlice.actions;
export default seoSlice.reducer;
