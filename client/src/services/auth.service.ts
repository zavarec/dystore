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
import { isServer, safeLocalStorage } from '@/utils/ssr';

export class AuthService {
  // Отправка кода подтверждения
  static async sendCode(data: SendCodeRequest): Promise<SendCodeResponse> {
    const response = await apiClient.post<SendCodeResponse>('/auth/send-code', data);
    return response.data;
  }

  // Проверка кода и получение токена
  static async verifyCode(data: VerifyCodeRequest): Promise<VerifyCodeResponse> {
    const response = await apiClient.post<VerifyCodeResponse>('/auth/verify-code', data);
    return response.data;
  }

  // Логин по username/password
  static async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  // Регистрация по username/password
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  // Получение профиля пользователя
  static async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data;
  }

  // ✅ ИСПРАВЛЕНИЕ: Безопасное сохранение токена
  static saveToken(token: string): void {
    safeLocalStorage.setItem('access_token', token);
  }

  // ✅ ИСПРАВЛЕНИЕ: Безопасное получение токена
  static getToken(): string | null {
    return safeLocalStorage.getItem('access_token');
  }

  // ✅ ИСПРАВЛЕНИЕ: Безопасное удаление токена
  static removeToken(): void {
    if (isServer) return;
    
    try {
      localStorage.removeItem('access_token');
    } catch (error) {
      // Игнорируем ошибки (например, если localStorage недоступен)
      console.warn('Не удалось удалить токен из localStorage:', error);
    }
  }

  // ✅ ИСПРАВЛЕНИЕ: Безопасная проверка авторизации
  static isAuthenticated(): boolean {
    if (isServer) return false;
    return !!this.getToken();
  }
}

export default AuthService;