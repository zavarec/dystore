import Cookies from 'js-cookie';

import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SendCodeRequest,
  SendCodeResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
} from '@/types/models/auth.model';
import type { User } from '@/types/models/user.model';
import { isServer } from '@/utils/ssr';

import { apiClient } from './api';

export type ApiError = Error & { status?: number; details?: unknown };

export class AuthService {
  static apiAuthUrl = '/api/auth'; // твой базовый URL

  private static async getOrInitCsrfToken(): Promise<string | undefined> {
    let token = Cookies.get('XSRF-TOKEN');
    if (!token) {
      try {
        await fetch('/api/csrf', { credentials: 'include' });
        token = Cookies.get('XSRF-TOKEN');
      } catch {}
    }
    return token;
  }
  // Отправка кода подтверждения
  static async sendCode(
    data: SendCodeRequest,
    opts?: { signal?: AbortSignal | null },
  ): Promise<SendCodeResponse> {
    const token = await this.getOrInitCsrfToken();

    // Заголовки типизируем широко
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { 'X-CSRF-Token': token } : {}),
    };

    // Формируем init без signal
    const init: RequestInit = {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify(data),
    };

    // Добавляем signal ТОЛЬКО если он есть (не undefined)
    if (opts?.signal ?? null) {
      (init as RequestInit & { signal: AbortSignal | null }).signal = opts.signal!;
    }

    const res = await fetch(`${this.apiAuthUrl}/send-code`, init);

    const ct = res.headers.get('content-type') ?? '';
    const isJson = ct.includes('application/json');
    const json = isJson ? await res.json().catch(() => null) : null;

    if (!res.ok) {
      const err: ApiError = new Error(json?.message || `HTTP ${res.status}`);
      err.status = res.status;
      err.details = json;
      throw err;
    }

    return (json ?? ({} as SendCodeResponse)) as SendCodeResponse;
  }

  // Проверка кода и получение токена
  static async verifyCode(data: VerifyCodeRequest): Promise<VerifyCodeResponse> {
    const token = await this.getOrInitCsrfToken();
    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'X-CSRF-Token': token } : {}),
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || 'Ошибка подтверждения кода');
    }
    return { access_token: '' };
  }

  // Логин по username/password через внутренний API (установит httpOnly cookie)
  static async login(data: LoginRequest): Promise<{ success: boolean }> {
    const token = await this.getOrInitCsrfToken();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'X-CSRF-Token': token } : {}),
      },
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
  // todo надо переписать а иначе не приходит профиль
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
    const token = await this.getOrInitCsrfToken();
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...(token ? { 'X-CSRF-Token': token } : {}),
      },
    });
  }

  // Проверка авторизации через попытку получить профиль (или через куку на сервере в middleware)
  static isAuthenticated(): boolean {
    if (isServer) return false;
    // Нет доступа к httpOnly cookie из JS — считаем неизвестным, полагаться на middleware/SSR
    return false;
  }
}

export default AuthService;
