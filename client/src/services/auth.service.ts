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

  // Сохранение токена
  static saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  // Получение токена
  static getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Удаление токена
  static removeToken(): void {
    localStorage.removeItem('access_token');
  }

  // Проверка авторизации
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default AuthService;
