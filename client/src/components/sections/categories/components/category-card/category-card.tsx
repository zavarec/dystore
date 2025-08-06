import React from 'react';
import { Category } from '@/types/models/category.model';
import { CategoryCardWrapper, CategoryImage, CategoryName } from './category-card.style';

interface CategoryCardProps {
  category: Category;
  onClick: (slug: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <CategoryCardWrapper
      onClick={() => onClick(category.slug)}
      whileHover={{ scale: 1.05, transformOrigin: 'center center' }}
      whileTap={{ scale: 0.95 }}
    >
      <CategoryImage src={category.image} alt={category.name} />
      <CategoryName>{category.name}</CategoryName>
    </CategoryCardWrapper>
  );
};
