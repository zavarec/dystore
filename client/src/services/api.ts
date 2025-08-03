import axios from 'axios';
import { isServer, safeLocalStorage } from '@/utils/ssr';

// Базовый URL API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Создаем экземпляр axios
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ ИСПРАВЛЕНИЕ: Интерцептор для добавления токена авторизации с SSR проверками
apiClient.interceptors.request.use(
  config => {
    // Добавляем токен только на клиенте
    if (!isServer) {
      const token = safeLocalStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// ✅ ИСПРАВЛЕНИЕ: Интерцептор для обработки ошибок авторизации с SSR проверками
apiClient.interceptors