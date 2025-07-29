import React from 'react';
import { SkeletonGrid, CategorySkeletonCard } from './categories-skeleton.style';

export const CategoriesSkeleton: React.FC = () => {
  return (
    <SkeletonGrid>
      {Array.from({ length: 6 }).map((_, index) => (
        <CategorySkeletonCard key={index} />
      ))}
    </SkeletonGrid>
  );
};
