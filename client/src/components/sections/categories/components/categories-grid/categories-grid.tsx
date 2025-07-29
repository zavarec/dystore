import React from 'react';
import { Category } from '@/types/models/category.model';
import { CategoryCard } from '../category-card';
import { GridContainer } from './categories-grid.style';

interface CategoriesGridProps {
  categories: Category[];
  onCategoryClick: (slug: string) => void;
}

export const CategoriesGrid: React.FC<CategoriesGridProps> = ({ categories, onCategoryClick }) => {
  return (
    <GridContainer>
      {categories.map((category: Category) => (
        <CategoryCard key={category.id} category={category} onClick={onCategoryClick} />
      ))}
    </GridContainer>
  );
};
