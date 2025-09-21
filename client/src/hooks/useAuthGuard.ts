import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from './redux';
import { selectIsAuthenticated, selectUser } from '@/store/slices/auth-slice/auth.selectors';
import { loadUserProfile } from '@/store/slices/auth-slice/auth.thunks';
import { UserRole } from '@/types/models/user.model';

interface UseAuthGuardOptions {
  allowedRoles?: UserRole[];
  redirectTo?: string;
  requireAuth?: boolean;
}

interface AuthGuardState {
  isLoading: boolean;
  isAuthorized: boolean;
  user: any;
  error: string | null;
}

export const useAuthGuard = (options: UseAuthGuardOptions = {}): AuthGuardState => {
  const { allowedRoles = [], redirectTo = '/admin/login', requireAuth = true } = options;

  const router = useRouter();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const [state, setState] = useState<AuthGuardState>({
    isLoading: true,
    isAuthorized: false,
    user: null,
    error: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        // Если пользователь не аутентифицирован, загружаем профиль
        if (!isAuthenticated && !user) {
          await dispatch(loadUserProfile()).unwrap();
        }

        // Если требуется авторизация, но пользователь не аутентифицирован
        if (requireAuth && !isAuthenticated) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            isAuthorized: false,
            error: 'Требуется авторизация',
          }));

          const next = encodeURIComponent(router.asPath);
          router.push(`${redirectTo}?next=${next}`);
          return;
        }

        // Если пользователь аутентифицирован, проверяем роли
        if (isAuthenticated && user) {
          const hasRequiredRole = allowedRoles.length === 0 || allowedRoles.includes(user.role);

          if (!hasRequiredRole) {
            setState(prev => ({
              ...prev,
              isLoading: false,
              isAuthorized: false,
              error: 'Недостаточно прав доступа',
            }));

            router.push('/');
            return;
          }

          setState(prev => ({
            ...prev,
            isLoading: false,
            isAuthorized: true,
            user,
            error: null,
          }));
        } else if (!requireAuth) {
          // Если авторизация не требуется
          setState(prev => ({
            ...prev,
            isLoading: false,
            isAuthorized: true,
            user: null,
            error: null,
          }));
        }
      } catch (error: any) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isAuthorized: false,
          error: error.message || 'Ошибка проверки авторизации',
        }));

        if (requireAuth) {
          const next = encodeURIComponent(router.asPath);
          router.push(`${redirectTo}?next=${next}`);
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, user, dispatch, router, allowedRoles, redirectTo, requireAuth]);

  return state;
};
