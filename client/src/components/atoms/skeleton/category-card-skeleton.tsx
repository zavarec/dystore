import React from 'react';
import { Skeleton, SkeletonText } from './skeleton';

interface CategoryCardSkeletonProps {
  variant?: 'tall' | 'square';
}

export const CategoryCardSkeleton: React.FC<CategoryCardSkeletonProps> = ({
  variant = 'square',
}) => {
  const isSquare = variant === 'square';
  const width = isSquare ? 260 : 280;
  const height = isSquare ? 260 : 350;

  return (
    <div style={{ width, minWidth: isSquare ? 240 : 260 }}>
      <div
        style={{
          width,
          height,
          borderRadius: isSquare ? 16 : 24,
          background: '#fff',
          border: '1px solid #e9ecef',
          overflow: 'hidden',
        }}
      >
        <Skeleton width={width} height={isSquare ? height : 280} variant="rounded" />
      </div>
      <div style={{ marginTop: 6 }}>
        <SkeletonText width={isSquare ? '90%' : '80%'} />
      </div>
    </div>
  );
};



