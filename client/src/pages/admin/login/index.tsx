// client/src/pages/admin/login.tsx
import React, { useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/hooks/redux';
import { selectIsAuthenticated } from '@/store/slices/auth-slice/auth.selectors';
import { UsernameAuthForm } from '@/features/auth/forms/username-auth-form';
import {
  LoginContainer,
  LoginCard,
  LoginHeader,
  LoginTitle,
  LoginSubtitle,
} from './admin-login-page.style';

const AdminLoginPage: NextPage = () => {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <LoginTitle>DyStore Admin</LoginTitle>
          <LoginSubtitle>Войдите для управления магазином</LoginSubtitle>
        </LoginHeader>
        <UsernameAuthForm />
      </LoginCard>
    </LoginContainer>
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
