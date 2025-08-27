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
      if (!isAuthenticated) {
        void router.replace('/admin/login');
        return;
      }
      if (isLoading) return;

      const allowed = user && (user.role === UserRole.MANAGER || user.role === UserRole.DIRECTOR);
      if (!allowed) {
        void router.replace('/');
      }
    }, [ready, isAuthenticated, isLoading, user, router]);

    if (!ready) return null;
    if (!isAuthenticated) return null;
    if (isLoading) return null;
    const allowed = user && (user.role === UserRole.MANAGER || user.role === UserRole.DIRECTOR);
    if (!allowed) return null;

    return <Component {...(props as P)} />;
  };

  Guarded.displayName = `withManager(${Component.displayName || Component.name || 'Component'})`;
  return Guarded;
}
