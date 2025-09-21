import React from 'react';
import { Category } from '@/types/models/category.model';
import {
  CategoryCardWrapper,
  CategoryImage,
  CategoryName,
  CategoryCardBox,
} from './category-card.style';

interface CategoryCardProps {
  category: Category;
  onClick: (slug: string) => void;
  variant?: 'tall' | 'square';
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onClick,
  variant = 'square',
}) => {
  return (
    <CategoryCardBox variant={variant}>
      <CategoryCardWrapper
        variant={variant}
        onClick={() => onClick(category.slug)}
        whileTap={{ scale: 0.95 }}
      >
        <CategoryImage variant={variant} src={category.imageUrl} alt={category.name} />
      </CategoryCardWrapper>
      <CategoryName variant={variant}>{category.name}</CategoryName>
    </CategoryCardBox>
  );
};
