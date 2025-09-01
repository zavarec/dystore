import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SendCodeRequest,
  SendCodeResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
} from '@/types/models/auth.model';
import { apiClient } from './api';
import { User } from '@/types/models/user.model';
import { isServer } from '@/utils/ssr';

export class AuthService {
  // Отправка кода подтверждения
  static async sendCode(data: SendCodeRequest): Promise<SendCodeResponse> {
    const response = await apiClient.post<SendCodeResponse>('/auth/send-code', data);
    return response.data;
  }

  // Проверка кода и получение токена
  static async verifyCode(data: VerifyCodeRequest): Promise<VerifyCodeResponse> {
    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || 'Ошибка подтверждения кода');
    }
    return { access_token: '' } as any;
  }

  // Логин по username/password через внутренний API (установит httpOnly cookie)
  static async login(data: LoginRequest): Promise<{ success: boolean }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || 'Ошибка входа');
    }
    return { success: true };
  }

  // Регистрация по username/password
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  // Получение профиля пользователя (кука добавится автоматически сервером)
  static async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/auth/profile', { withCredentials: true });
    return response.data;
  }

  // Методы работы с токеном больше не используются на клиенте (куки httpOnly)
  static saveToken(_token: string): void {}

  static getToken(): string | null {
    return null;
  }

  static async removeToken(): Promise<void> {
    if (isServer) return;
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  }

  // Проверка авторизации через попытку получить профиль (или через куку на сервере в middleware)
  static isAuthenticated(): boolean {
    if (isServer) return false;
    // Нет доступа к httpOnly cookie из JS — считаем неизвестным, полагаться на middleware/SSR
    return false;
  }
}

export default AuthService;
