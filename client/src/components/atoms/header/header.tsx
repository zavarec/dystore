import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { logout } from '@/store/slices/auth-slice/auth.thunks';
import { setAuthModalOpen } from '@/store/slices/uiSlice';
import { useCategories } from '@/hooks/useCategories';
import { CategoryTreeUtils } from '@/types/models/category.model';

import { useLocalStorage } from '@/utils/ssr';

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

  // ✅ ИСПРАВЛЕНИЕ: Безопасное получение данных корзины
  const [cartItems, , isCartHydrated] = useLocalStorage('simpleCart', []);

  // Загружаем категории
  const { categories, loading: categoriesLoading } = useCategories();

  // ✅ ИСПРАВЛЕНИЕ: Безопасное вычисление количества товаров в корзине
  const cartItemsCount = isCartHydrated
    ? (cartItems as any[]).reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)
    : 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    console.log(user, 'user');

    const handleCartUpdate = () => {
      // Обновление произойдет автоматически через useLocalStorage
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Строим дерево категорий (только корневые категории для навигации)
  const categoryTree = React.useMemo(() => {
    if (!categories || categories.length === 0) return [];

    console.log(categories, 'categories');

    const tree = CategoryTreeUtils.buildTree(categories);
    // Возвращаем только корневые категории для главной навигации
    return tree;
  }, [categories]);

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
            <img
              src="https://www.dyson.com/etc.clientlibs/dyson/clientlibs/clientlib-main/resources/images/dyson-logo.svg"
              alt="DyStore"
              width={100}
              height={100}
            />
          </Logo>

          <Navigation $isOpen={isMobileMenuOpen}>
            {categoriesLoading ? (
              <div style={{ color: '#ffffff', padding: '8px 0' }}>Загрузка категорий...</div>
            ) : (
              categoryTree.map(category => {
                const isActive = router.asPath.startsWith(`/category/${category.slug}`);
                return (
                  <CategoryDropdown
                    key={category.id}
                    category={category}
                    isActive={isActive}
                    loading={categoriesLoading}
                  />
                );
              })
            )}
          </Navigation>
        </HeaderLeft>

        <HeaderRight>
          <SearchContainer>
            <form onSubmit={handleSearch}>
              <SearchInput
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </form>

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

            {/* ✅ ИСПРАВЛЕНИЕ: Корзина с безопасным отображением счетчика */}
            <Link href="/cart" passHref legacyBehavior>
              <CartButton count={isCartHydrated ? cartItemsCount : 0} />
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
