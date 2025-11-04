import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import AuthService from '@/services/auth.service';
import type {
  LoginRequest,
  RegisterRequest,
  SendCodeRequest,
  VerifyCodeRequest,
} from '@/types/models/auth.model';

// Async thunks
export const sendCode = createAsyncThunk(
  'auth/sendCode',
  async (data: SendCodeRequest, { rejectWithValue }) => {
    try {
      const response = await AuthService.sendCode(data);
      return { ...response, phone: data.phone };
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка при отправке кода');
      }
    }
  },
);

export const verifyCode = createAsyncThunk(
  'auth/verifyCode',
  async (data: VerifyCodeRequest, { rejectWithValue }) => {
    try {
      await AuthService.verifyCode(data);
      const user = await AuthService.getProfile();
      return { user, token: null };
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка при проверке кода');
      }
    }
  },
);

export const loadUserProfile = createAsyncThunk(
  'auth/loadUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const user = await AuthService.getProfile();
      return user;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки профиля');
      }
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await AuthService.removeToken();
  return true;
});

// Новые async thunks для username/password авторизации
export const loginWithPassword = createAsyncThunk(
  'auth/loginWithPassword',
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      await AuthService.login(data);
      const user = await AuthService.getProfile();
      return { user, token: null };
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка при входе');
      }
    }
  },
);

export const registerWithPassword = createAsyncThunk(
  'auth/registerWithPassword',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      // const response = await AuthService.register(data);
      // После регистрации сразу авторизуем через внутренний login (если сервер сразу не ставит куку)
      await AuthService.login({ email: data.email, password: data.password });
      const user = await AuthService.getProfile();
      return { user, token: null };
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка при регистрации');
      }
    }
  },
);
