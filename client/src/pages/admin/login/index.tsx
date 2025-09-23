import { useEffect } from 'react';

import type { GetServerSideProps, NextPage } from 'next';

import { useRouter } from 'next/router';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { UsernameAuthForm } from '@/features/auth/forms/username-auth-form';
import { useAppSelector } from '@/hooks/redux';
import { selectIsAuthenticated, selectUser } from '@/store/slices/auth-slice/auth.selectors';
import {
  LoginContainer as SLoginContainer,
  LoginCard as SLoginCard,
  LoginHeader as SLoginHeader,
  LoginTitle as SLoginTitle,
  LoginSubtitle as SLoginSubtitle,
} from '@/styles/pages/admin/admin-login-page.style';
import { UserRole } from '@/types/models/user.model';

// Перенос стилей из pages в styles

const AdminLoginPage: NextPage = () => {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!user) return;
    const allowed = user.role === UserRole.MANAGER || user.role === UserRole.DIRECTOR;
    if (allowed) {
      router.push('/admin');
    }
  }, [isAuthenticated, user, router]);

  return (
    <SLoginContainer>
      <SLoginCard>
        <SLoginHeader>
          <SLoginTitle>DysonGroup Admin</SLoginTitle>
          <SLoginSubtitle>Войдите для управления магазином</SLoginSubtitle>
        </SLoginHeader>

        <UsernameAuthForm redirectTo="/admin" />
      </SLoginCard>
    </SLoginContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ru', ['common'])),
    },
  };
};

export default AdminLoginPage;
