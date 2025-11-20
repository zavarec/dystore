import { useState, useEffect, useMemo } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { MobileCategoryList } from '@/components/atoms/mobile-category-list/mobile-category-list';
import { Skeleton } from '@/components/atoms/skeleton';
import { CartButton } from '@/features/cart/cart-button/cart-button';
import { ClientSearch } from '@/features/search/client-search';
import { CategoryDropdown } from '@/features/categories/category-dropdown';
import { useCategories } from '@/hooks/useCategories';
import { CategoryTreeUtils } from '@/types/models/category.model';

import {
  MotionHeaderContainer,
  HeaderContent,
  Navigation,
  MobileMenuButton,
  MenuLine,
  SearchContainer,
  HeaderLeft,
  HeaderRight,
} from './header.style';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState('');

  const router = useRouter();

  const { categories, loading: categoriesLoading } = useCategories();

  const categoryTree = useMemo(() => {
    if (!categories || categories.length === 0) return [];

    const tree = CategoryTreeUtils.buildTree(categories);

    return tree;
  }, [categories]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (searchQuery.trim()) {
  //     router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  //   }
  // };

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
          <Navigation $isOpen={isMobileMenuOpen}>
            {categoriesLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} width={80} height={16} />
                ))}
              </div>
            ) : (
              <>
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

                <div className="mobile-nav">
                  <MobileCategoryList categories={categoryTree} loading={categoriesLoading} />
                </div>
              </>
            )}
          </Navigation>
        </HeaderLeft>

        <HeaderRight>
          <SearchContainer>
            <ClientSearch />

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
