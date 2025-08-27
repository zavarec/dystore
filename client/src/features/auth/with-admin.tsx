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

      // Если не авторизован — отправляем на логин
      if (!isAuthenticated) {
        void router.replace('/admin/login');
        return;
      }

      // Пока профиль загружается — ничего не делаем (избегаем ложного редиректа)
      if (isLoading) return;

      // Авторизован, но не директор — отправляем на главную
      if (!user || user.role !== UserRole.DIRECTOR) {
        void router.replace('/');
      }
    }, [ready, isAuthenticated, isLoading, user, router]);

    // Пока проверяем или редиректим — ничего не рендерим
    if (!ready) return null;
    if (!isAuthenticated) return null;
    if (isLoading) return null;
    if (!user || user.role !== UserRole.DIRECTOR) return null;

    return <Component {...(props as P)} />;
  };

  Guarded.displayName = `withAdmin(${Component.displayName || Component.name || 'Component'})`;
  return Guarded;
}
