import { useEffect, useRef } from 'react';

import { CategoryCardSkeleton } from '@/components/atoms/skeleton';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useIsOverflow } from '@/hooks/use-is-overflow';
import {
  selectIsRootCategoriesLoading,
  selectRootCategories,
} from '@/store/slices/categories-slice/categories.selectors';
import { fetchRootCategories } from '@/store/slices/categories-slice/categories.thunks';

import {
  CategoriesSection,
  CategoriesContainer,
  CategoriesHeader,
  CategoriesTitle,
  ScrollContainer,
} from './categories.style';
import { CategoryCard } from './components';

export const Categories: React.FC = () => {
  const dispatch = useAppDispatch();

  const categories = useAppSelector(selectRootCategories);
  const isLoading = useAppSelector(selectIsRootCategoriesLoading);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isOverflow = useIsOverflow(scrollContainerRef);
  const center = !isOverflow;

  useEffect(() => {
    dispatch(fetchRootCategories());
  }, [dispatch]);

  const handleCategoryClick = (categorySlug: string) => {
    // Переход к странице категории
    window.location.href = `/category/${categorySlug}`;
  };

  // При загрузке показываем скелеты с размерами карточек
  if (isLoading) {
    return (
      <CategoriesSection>
        <CategoriesContainer>
          <CategoriesHeader>
            <CategoriesTitle>Категории товаров</CategoriesTitle>
          </CategoriesHeader>
          <ScrollContainer>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: '0 0 auto',
                  scrollSnapAlign: 'start',
                  minWidth: '220px',
                }}
              >
                <CategoryCardSkeleton variant="square" />
              </div>
            ))}
          </ScrollContainer>
        </CategoriesContainer>
      </CategoriesSection>
    );
  }

  return (
    <CategoriesSection>
      <CategoriesContainer>
        <CategoriesHeader>
          <CategoriesTitle>Категории товаров</CategoriesTitle>
        </CategoriesHeader>

        <ScrollContainer ref={scrollContainerRef} $center={center}>
          {categories.map(category => (
            <div
              key={category.id}
              style={{
                flex: '0 0 auto',
                scrollSnapAlign: 'start',
                minWidth: '220px',
              }}
            >
              <CategoryCard category={category} onClick={handleCategoryClick} />
            </div>
          ))}
        </ScrollContainer>
      </CategoriesContainer>
    </CategoriesSection>
  );
};
