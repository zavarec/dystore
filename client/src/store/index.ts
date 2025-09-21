import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import productsSlice from './slices/products-slice/products.slice';
import filtersSlice from './slices/filter-slice/filters.slice';
import uiSlice from './slices/uiSlice';
import authSlice from './slices/auth-slice/auth.slice';
import cartSlice from './slices/cart-slice/cart.slice';
import categoriesSlice from './slices/categories-slice/categories.slice';
import ordersSlice from './slices/orders-slice/orders.slice';
import promotionsSlice from './slices/promotion-slice/promotion.slice';
import sectionsWithPlacementsSlice from './slices/promo/promo.slice';

import seoSlice from './slices/seo-meta-slice/seo.slice';

const makeStore = () =>
  configureStore({
    reducer: {
      productsSlice,
      categoriesSlice,
      ordersSlice,
      filtersSlice,
      uiSlice,
      authSlice,
      cartSlice,
      seoSlice,
      promotionsSlice,
      sectionsWithPlacementsSlice,
    },

    devTools: process.env.NODE_ENV !== 'production',
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const wrapper = createWrapper<AppStore>(makeStore, {
  debug: process.env.NODE_ENV === 'development',
});
