import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  CategoriesSection,
  CategoriesContainer,
  CategoriesHeader,
  CategoriesTitle,
  ScrollContainer,
} from './categories.style';
import { fetchRootCategories } from '@/store/slices/categories-slice/categories.thunks';
import { CategoriesSkeleton, CategoryCard } from './components';
import {
  selectIsRootCategoriesLoading,
  selectRootCategories,
} from '@/store/slices/categories-slice/categories.selectors';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';

export const Categories: React.FC = () => {
  const dispatch = useAppDispatch();

  const categories = useAppSelector(selectRootCategories);
  const isLoading = useAppSelector(selectIsRootCategoriesLoading);

  useEffect(() => {
    dispatch(fetchRootCategories());
  }, [dispatch]);

  const handleCategoryClick = (categorySlug: string) => {
    // Переход к странице категории
    window.location.href = `/category/${categorySlug}`;
  };

  if (isLoading) {
    return (
      <CategoriesSection>
        <CategoriesContainer>
          <CategoriesHeader>
            <CategoriesTitle>Категории товаров</CategoriesTitle>
          </CategoriesHeader>
          <CategoriesSkeleton />
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

        <ScrollContainer>
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
