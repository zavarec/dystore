import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';

import { useAppSelector } from '@/hooks/redux';
import {
  selectIsAuthenticated,
  selectUser,
  selectIsLoading,
} from '@/store/slices/auth-slice/auth.selectors';
import { UserRole } from '@/types/models/user.model';

export function withAdmin<P extends object>(Component: NextPage<P>) {
  const Guarded: NextPage<P> = (props: P) => {
    const router = useRouter();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);
    const isLoading = useAppSelector(selectIsLoading);
    const [ready, setReady] = useState(false);

    useEffect(() => {
      // Дожидаемся монтирования, затем проверяем доступ
      setReady(true);
    }, []);

    useEffect(() => {
      if (!ready) return;
      // 1) Пока грузится профиль — ничего не делаем
      if (isLoading) return;

      // 2) Нет авторизации — на страницу логина
      if (!isAuthenticated) {
        void router.replace('/admin/login');
        return;
      }

      // 3) Профиль ещё не подгружен — ждём без редиректа
      if (!user) return;

      // 4) Есть пользователь, но роль не директор — домой
      if (user.role !== UserRole.DIRECTOR) {
        void router.replace('/');
      }
    }, [ready, isAuthenticated, isLoading, user, router]);

    // Пока проверяем или редиректим — ничего не рендерим
    if (!ready) return null;
    if (isLoading) return null;
    if (!isAuthenticated) return null;
    if (!user) return null;
    if (user.role !== UserRole.DIRECTOR) return null;

    return <Component {...(props as P)} />;
  };

  Guarded.displayName = `withAdmin(${Component.displayName || Component.name || 'Component'})`;
  return Guarded;
}
