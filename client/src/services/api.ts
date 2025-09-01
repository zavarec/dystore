import axios from 'axios';
// import { isServer } from '@/utils/ssr';
import Cookies from 'js-cookie';

// Базовый URL API
const API_BASE_URL = '/api/proxy';

// Создаем экземпляр axios
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ✅ ИСПРАВЛЕНИЕ: Интерцептор для добавления токена авторизации с SSR проверками
// Для httpOnly куки токен добавляется сервером автоматически, заголовок Authorization не нужен
apiClient.interceptors.request.use(
  config => config,
  error => Promise.reject(error),
);

// // ✅ ИСПРАВЛЕНИЕ: Интерцептор для обработки ошибок авторизации с SSR проверками
apiClient.interceptors.response.use(
  response => response,
  error => Promise.reject(error),
);

// Интерцептор для добавления CSRF токена в небезопасные методы
apiClient.interceptors.request.use(config => {
  const method = (config.method || 'get').toUpperCase();
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const token = Cookies.get('XSRF-TOKEN');
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any)['X-CSRF-Token'] = token;
    }
  }
  return config;
});
