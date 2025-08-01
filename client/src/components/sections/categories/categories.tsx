import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  CategoriesSection,
  CategoriesContainer,
  CategoriesHeader,
  CategoriesTitle,
} from './categories.style';
import { fetchRootCategories } from '@/store/slices/categories-slice/categories.thunks';
import { CategoriesGrid, CategoriesSkeleton } from './components';
import {
  selectIsRootCategoriesLoading,
  selectRootCategories,
} from '@/store/slices/categories-slice/categories.selectors';

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
        <CategoriesGrid categories={categories} onCategoryClick={handleCategoryClick} />
      </CategoriesContainer>
    </CategoriesSection>
  );
};
