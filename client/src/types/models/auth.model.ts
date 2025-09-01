export interface SendCodeRequest {
  phone: string;
}

export interface SendCodeResponse {
  message: string;
}

export interface VerifyCodeRequest {
  phone: string;
  code: string;
}

export interface VerifyCodeResponse {
  access_token: string; // оставлено для обратной совместимости, но на клиенте не используется
}

// Новые интерфейсы для email/password авторизации
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  access_token: string; // оставлено для обратной совместимости, но на клиенте не используется
}
