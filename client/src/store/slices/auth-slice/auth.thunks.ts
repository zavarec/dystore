import AuthService from '@/services/auth.service';
import {
  LoginRequest,
  RegisterRequest,
  SendCodeRequest,
  VerifyCodeRequest,
} from '@/types/models/auth.model';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const sendCode = createAsyncThunk(
  'auth/sendCode',
  async (data: SendCodeRequest, { rejectWithValue }) => {
    try {
      const response = await AuthService.sendCode(data);
      return { ...response, phone: data.phone };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при отправке кода');
    }
  },
);

export const verifyCode = createAsyncThunk(
  'auth/verifyCode',
  async (data: VerifyCodeRequest, { rejectWithValue }) => {
    try {
      const response = await AuthService.verifyCode(data);
      // Сохраняем токен
      AuthService.saveToken(response.access_token);

      // Получаем профиль пользователя
      const user = await AuthService.getProfile();

      return { user, token: response.access_token };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при проверке кода');
    }
  },
);

export const loadUserProfile = createAsyncThunk(
  'auth/loadUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      if (!AuthService.isAuthenticated()) {
        throw new Error('Пользователь не авторизован');
      }

      const user = await AuthService.getProfile();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки профиля');
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  AuthService.removeToken();
  return true;
});

// Новые async thunks для username/password авторизации
export const loginWithPassword = createAsyncThunk(
  'auth/loginWithPassword',
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(data);
      // Сохраняем токен
      AuthService.saveToken(response.access_token);

      // Получаем профиль пользователя
      const user = await AuthService.getProfile();

      return { user, token: response.access_token };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при входе');
    }
  },
);

export const registerWithPassword = createAsyncThunk(
  'auth/registerWithPassword',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await AuthService.register(data);
      // Сохраняем токен
      AuthService.saveToken(response.access_token);

      // Получаем профиль пользователя
      const user = await AuthService.getProfile();

      return { user, token: response.access_token };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при регистрации');
    }
  },
);
