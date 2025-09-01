import axios from 'axios';

// Серверный axios-клиент для использования в getStaticProps/getStaticPaths/SSR
// Ходит напрямую в бэкенд (минуя Next API proxy)
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api';

export const serverApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // На сервере куки/креды не нужны для публичных ресурсов
  withCredentials: false,
});

// Проще пробрасывать ошибку наверх и обрабатывать в getStaticProps
serverApiClient.interceptors.response.use(
  response => response,
  error => Promise.reject(error),
);

export default serverApiClient;
