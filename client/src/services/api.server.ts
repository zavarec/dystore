import axios from 'axios';

// Серверный axios-клиент для использования в getStaticProps/getStaticPaths/SSR
// Ходит напрямую в бэкенд (минуя Next API proxy). На сервере используем внутренний URL.
const apiHost = process.env.API_URL_SERVER || 'http://localhost:3001/api';
const API_BASE_URL = apiHost;

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
