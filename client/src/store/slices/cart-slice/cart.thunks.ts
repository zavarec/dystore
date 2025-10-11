import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { CartService } from '@/services';
import type { AddToCartRequest } from '@/types/models/cart.model';

// Получить корзину
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    return await CartService.getCart();
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки корзины');
    }
  }
});

// Добавить товар в корзину
export const addToCart = createAsyncThunk('cart/addToCart', async (data: AddToCartRequest) => {
  return await CartService.addToCart(data);
});

// Удалить товар из корзины
export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId: number) => {
  return await CartService.removeFromCart(productId);
});

// Получить общую стоимость корзины
export const fetchCartTotal = createAsyncThunk('cart/fetchCartTotal', async () => {
  return await CartService.getCartTotal();
});

// Очистить корзину
export const clearCart = createAsyncThunk('cart/clearCart', async () => {
  await CartService.clearCart();
  return null;
});
