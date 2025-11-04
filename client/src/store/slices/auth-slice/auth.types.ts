import { type User } from '@/types/models/user.model';

export interface AuthState {
  // Состояние пользователя
  user: User | null;
  isAuthenticated: boolean;

  // Состояние загрузки
  isLoading: boolean;

  // Состояние отправки кода
  codeSent: boolean;
  codeSentTo: string | null;

  // Ошибки
  error: string | null;

  // Таймер для повторной отправки кода
  canResendCodeAt: number | null;
}
