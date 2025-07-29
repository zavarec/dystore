import axios from 'axios';

// Базовый URL API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Создаем экземпляр axios
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена авторизации
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Интерцептор для обработки ошибок авторизации
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Удаляем токен при ошибке авторизации
      localStorage.removeItem('access_token');

      // УБРАНО: Автоматический редирект на страницу авторизации
      // Теперь авторизация происходит только по кнопке "Войти"
      // if (
      //   typeof window !== 'undefined' &&
      //   window.location.pathname !== '/auth'
      // ) {
      //   window.location.href = '/auth';
      // }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
