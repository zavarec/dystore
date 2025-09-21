import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { useAppSelector } from '@/hooks/redux';
import {
  selectIsAuthenticated,
  selectIsLoading,
  selectUser,
} from '@/store/slices/auth-slice/auth.selectors';
import { UserRole } from '@/types/models/user.model';
import { LoadingSpinner } from '@/components/atoms/loading-spinner/loading-spinner';

export function withManager<P extends object>(Component: NextPage<P>) {
  const Guarded: NextPage<P> = (props: P) => {
    const router = useRouter();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);
    const isLoading = useAppSelector(selectIsLoading);
    const [ready, setReady] = useState(false);

    useEffect(() => {
      setReady(true);
    }, []);

    useEffect(() => {
      if (!ready) return;
      // Пока профиль грузится — не редиректим
      if (isLoading) return;

      // Нет аутентификации после загрузки — отправляем на логин
      if (!isAuthenticated) {
        void router.replace('/admin/login');
        return;
      }

      // Профиль ещё не подгружен — ждём
      if (!user) return;

      // Проверяем роли только когда пользователь загружен
      const allowed = user.role === UserRole.MANAGER || user.role === UserRole.DIRECTOR;
      if (!allowed) {
        void router.replace('/admin/login');
      }
    }, [ready, isAuthenticated, isLoading, user, router]);

    if (!ready) return <LoadingSpinner />;
    if (isLoading) return <LoadingSpinner />;
    if (!isAuthenticated) return <LoadingSpinner />;
    if (!user) return <LoadingSpinner />;
    const allowed = user.role === UserRole.MANAGER || user.role === UserRole.DIRECTOR;
    if (!allowed) return <LoadingSpinner />;

    return <Component {...(props as P)} />;
  };

  Guarded.displayName = `withManager(${Component.displayName || Component.name || 'Component'})`;
  return Guarded;
}
