import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { logout } from '@/store/slices/auth-slice/auth.thunks';
import { setAuthModalOpen } from '@/store/slices/uiSlice';
import { useCategories } from '@/hooks/useCategories';
import { CategoryTreeUtils } from '@/types/models/category.model';

import {
  MotionHeaderContainer,
  HeaderContent,
  Logo,
  Navigation,
  MobileMenuButton,
  MenuLine,
  SearchContainer,
  SearchInput,
  AuthButton,
  UserInfo,
  UserName,
  LogoutButton,
  HeaderLeft,
  HeaderRight,
} from './header.style';

import { selectIsAuthenticated, selectUser } from '@/store/slices/auth-slice/auth.selectors';
import { NoSSR } from '@/components/atoms/no-ssr/no-ssr';
import { CategoryDropdown } from '@/features/categories/category-dropdown';
import { CartButton } from '@/features/cart/cart-button/cart-button';
import { MobileCategoryList } from '@/components/atoms/mobile-category-list/mobile-category-list';
import { Skeleton } from '@/components/atoms/skeleton';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const router = useRouter();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  // Загружаем категории
  const { categories, loading: categoriesLoading } = useCategories();

  // Строим дерево категорий (только корневые категории для навигации)
  const categoryTree = React.useMemo(() => {
    if (!categories || categories.length === 0) return [];

    console.log(categories, 'categories');

    const tree = CategoryTreeUtils.buildTree(categories);
    // Возвращаем только корневые категории для главной навигации
    return tree;
  }, [categories]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    console.log(user, 'user');

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Закрывать мобильное меню при прокрутке вниз на небольшой порог
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const startY = window.scrollY;
    const threshold = 70; // px
    const handleScroll = () => {
      if (window.scrollY > startY + threshold) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true } as AddEventListenerOptions);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/');
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      router.push('/profile');
    } else {
      // Всегда открываем модальное окно авторизации
      dispatch(setAuthModalOpen(true));
    }
  };

  return (
    <MotionHeaderContainer
      $isScrolled={isScrolled}
      className={className}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <HeaderContent>
        <HeaderLeft>
          <Logo href="/">
            <Image
              src="https://s3.twcstorage.ru/49dbf9e8-45b07930-284b-4614-95f5-5a9bdcbd9f92/uploads/2fa45b9c-691a-4027-aa83-3e800e2a35a4-dyson-logo.svg"
              alt="DysonGroup"
              width={100}
              height={24}
              sizes="(max-width: 768px) 40vw, 20vw"
              priority
            />
          </Logo>

          <Navigation $isOpen={isMobileMenuOpen}>
            {categoriesLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} width={80} height={16} />
                ))}
              </div>
            ) : (
              <>
                {/* Desktop: выпадающие меню по hover */}
                <div className="desktop-nav">
                  {categoryTree.map(category => {
                    const isActive = router.asPath.startsWith(`/category/${category.slug}`);
                    return (
                      <CategoryDropdown
                        key={category.id}
                        category={category}
                        isActive={isActive}
                        loading={categoriesLoading}
                      />
                    );
                  })}
                </div>

                {/* Mobile: вертикальный список с раскрытием подкатегорий */}
                <div className="mobile-nav">
                  <MobileCategoryList
                    categories={categoryTree as any}
                    loading={categoriesLoading}
                  />
                </div>
              </>
            )}
          </Navigation>
        </HeaderLeft>

        <HeaderRight>
          <SearchContainer>
            {/* todo: test and add search products in all categories functionality */}
            {/* <form onSubmit={handleSearch}>
              <SearchInput
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </form> */}

            {/* ✅ ИСПРАВЛЕНИЕ: Информация о пользователе безопасно рендерится */}
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

            <Link href="/cart" passHref legacyBehavior>
              <CartButton />
            </Link>
          </SearchContainer>

          <MobileMenuButton
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Меню"
          >
            {[0, 1, 2].map(index => (
              <MenuLine key={index} $isOpen={isMobileMenuOpen} $index={index} />
            ))}
          </MobileMenuButton>
        </HeaderRight>
      </HeaderContent>
    </MotionHeaderContainer>
  );
};
