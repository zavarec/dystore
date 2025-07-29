import { OrdersService } from '@/services';
import { CreateOrderRequest } from '@/types/models/order.model';

import { createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (data: CreateOrderRequest, { rejectWithValue }) => {
    try {
      return await OrdersService.createOrder(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка создания заказа');
    }
  },
);

export const fetchOrderHistory = createAsyncThunk(
  'orders/fetchOrderHistory',
  async (_, { rejectWithValue }) => {
    try {
      return await OrdersService.getOrderHistory();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки истории заказов');
    }
  },
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await OrdersService.getOrderById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Заказ не найден');
    }
  },
);
