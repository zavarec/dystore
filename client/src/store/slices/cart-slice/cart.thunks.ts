import { createAsyncThunk } from '@reduxjs/toolkit';
import { CartService } from '@/services';
import { AddToCartRequest } from '@/types/models/cart.model';

// Получить корзину
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    return await CartService.getCart();
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки корзины');
  }
});

// Добавить товар в корзину
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (data: AddToCartRequest, { rejectWithValue }) => {
    try {
      return await CartService.addToCart(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка добавления в корзину');
    }
  },
);

// Удалить товар из корзины
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId: number, { rejectWithValue }) => {
    try {
      return await CartService.removeFromCart(productId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления из корзины');
    }
  },
);

// Получить общую стоимость корзины
export const fetchCartTotal = createAsyncThunk(
  'cart/fetchCartTotal',
  async (_, { rejectWithValue }) => {
    try {
      return await CartService.getCartTotal();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка подсчета стоимости');
    }
  },
);

// Очистить корзину
export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    await CartService.clearCart();
    return null;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Ошибка очистки корзины');
  }
});
