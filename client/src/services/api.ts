import axios from 'axios';
import { isServer, safeLocalStorage } from '@/utils/ssr';

// Базовый URL API
const API_BASE_URL = 'http://localhost:3001/api';

// Создаем экземпляр axios
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || API_BASE_URL,
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

// // ✅ ИСПРАВЛЕНИЕ: Интерцептор для обработки ошибок авторизации с SSR проверками
apiClient.interceptors.response.use(
  response => response,
  error => {
    try {
      const status = error?.response?.status;
      if (!isServer && status === 401) {
        // Токен протух — очищаем и даём возможность переавторизоваться
        safeLocalStorage.setItem('access_token', '');
      }
    } catch {}
    return Promise.reject(error);
  },
);
