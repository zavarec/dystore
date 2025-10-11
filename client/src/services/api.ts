import axios from 'axios';
import { toast } from 'react-toastify';
// import { isServer } from '@/utils/ssr';

// Базовый URL API
const API_BASE_URL = '/api/proxy';

// Создаем экземпляр axios
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN', // имя cookie с токеном
  xsrfHeaderName: 'X-XSRF-TOKEN', // заголовок, который пошлёт axios
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
  error => {
    const method = error.config?.method?.toUpperCase();
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method ?? '');

    if (isMutation) {
      const message =
        error.response?.data?.message || error.message || 'Произошла ошибка при выполнении запроса';

      toast.error(message);
    }

    return Promise.reject(error);
  },
);
