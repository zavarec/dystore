import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';

import { NoSSR } from '@/components/atoms/no-ssr/no-ssr';
import {
  AuthButton,
  LogoutButton,
  UserInfo,
  UserName,
} from '@/components/atoms/header/header.style';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectIsAuthenticated, selectUser } from '@/store/slices/auth-slice/auth.selectors';
import { logout } from '@/store/slices/auth-slice/auth.thunks';
import { setAuthModalOpen } from '@/store/slices/uiSlice';

import {
  TopHeaderContainer,
  TopHeaderContent,
  TopLogo,
  TopNav,
  TopPhoneNumber,
  TopRight,
} from './top-header.style';
import { COMPANY_INFO } from '@/constants/contacts.constants';
import { PhoneIcon } from '@phosphor-icons/react';

export const TopHeader: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/');
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      router.push('/profile');
    } else {
      dispatch(setAuthModalOpen(true));
    }
  };

  return (
    <TopHeaderContainer>
      <TopHeaderContent>
        <TopLogo href="/" aria-label="Домой">
          <Image
            src="https://s3.twcstorage.ru/49dbf9e8-45b07930-284b-4614-95f5-5a9bdcbd9f92/uploads/2fa45b9c-691a-4027-aa83-3e800e2a35a4-dyson-logo.svg"
            alt="DysonGroup"
            width={74}
            height={28}
            sizes="(max-width: 768px) 40vw, 20vw"
            priority
          />
        </TopLogo>

        <TopRight>
          {COMPANY_INFO.COMPANY_PHONE_NUMBER && (
            <TopPhoneNumber href="tel:+74951064096">
              <PhoneIcon />
              <span>{COMPANY_INFO.COMPANY_PHONE_NUMBER}</span>
            </TopPhoneNumber>
          )}

          <TopNav>
            <Link href="/delivery">Доставка</Link>
            <Link href="/delivery">Оплата</Link>
            <Link href="/about">О нас</Link>
            <Link href="/contacts">Контакты</Link>
          </TopNav>

          <NoSSR
            fallback={
              <AuthButton onClick={handleAuthClick} aria-label="Войти в аккаунт">
                Войти
              </AuthButton>
            }
          >
            {isAuthenticated && user ? (
              <UserInfo>
                <UserName>{user.username}</UserName>
                <LogoutButton onClick={handleLogout} aria-label="Выйти из аккаунта">
                  Выйти
                </LogoutButton>
              </UserInfo>
            ) : (
              <AuthButton onClick={handleAuthClick} aria-label="Войти в аккаунт">
                Войти
              </AuthButton>
            )}
          </NoSSR>
        </TopRight>
      </TopHeaderContent>
    </TopHeaderContainer>
  );
};
