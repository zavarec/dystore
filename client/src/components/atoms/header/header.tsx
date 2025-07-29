import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { logout } from '@/store/slices/auth-slice/auth.thunks';
import { setAuthModalOpen } from '@/store/slices/uiSlice';
import { useCategories } from '@/hooks/useCategories';
import { CategoryDropdown } from '@/components/atoms/category-dropdown';
import { CategoryTreeUtils } from '@/types/models/category.model';
import { CartButton } from '@/components/atoms/cart-button/cart-button';

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
} from './header.style';

import { selectIsAuthenticated, selectUser } from '@/store/slices/auth-slice/auth.selectors';

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
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Загружаем категории
  const { categories, loading: categoriesLoading } = useCategories();

  // Функция для подсчета товаров в корзине
  const updateCartCount = () => {
    const cartData = localStorage.getItem('simpleCart');
    if (cartData) {
      try {
        const cart = JSON.parse(cartData);
        const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartItemsCount(totalItems);
      } catch (error) {
        setCartItemsCount(0);
      }
    } else {
      setCartItemsCount(0);
    }
  };

  // Обновляем счетчик при загрузке и при изменении корзины
  useEffect(() => {
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Строим дерево категорий (только корневые категории для навигации)
  const categoryTree = React.useMemo(() => {
    if (!categories || categories.length === 0) return [];
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
        <Logo href="/">DyStore</Logo>

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

        <SearchContainer>
          <form onSubmit={handleSearch}>
            <SearchInput
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </form>

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

          <Link href="/cart" passHref legacyBehavior>
            <CartButton count={cartItemsCount} />
          </Link>
        </SearchContainer>

        <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Меню">
          Меню
          {[0, 1, 2].map(index => (
            <MenuLine key={index} $isOpen={isMobileMenuOpen} $index={index} />
          ))}
        </MobileMenuButton>
      </HeaderContent>
    </MotionHeaderContainer>
  );
};
