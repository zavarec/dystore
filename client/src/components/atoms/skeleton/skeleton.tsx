import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

// Анимация пульсации
const pulseAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
`;

// Базовый компонент скелетона
const SkeletonBase = styled.div<{
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  variant?: 'rectangular' | 'circular' | 'rounded';
}>`
  background-color: #e9ecef;
  animation: ${pulseAnimation} 2s ease-in-out infinite;
  display: inline-block;

  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width || '100%')};
  height: ${({ height }) => (typeof height === 'number' ? `${height}px` : height || '20px')};

  border-radius: ${({ variant, borderRadius }) => {
    if (borderRadius) {
      return typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;
    }
    switch (variant) {
      case 'circular':
        return '50%';
      case 'rounded':
        return '8px';
      default:
        return '4px';
    }
  }};
`;

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  variant?: 'rectangular' | 'circular' | 'rounded';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = props => {
  return <SkeletonBase {...props} />;
};

// Готовые компоненты для разных случаев
export const SkeletonText: React.FC<{ width?: string | number }> = ({ width = '100%' }) => (
  <Skeleton width={width} height={16} />
);

export const SkeletonTitle: React.FC<{ width?: string | number }> = ({ width = '60%' }) => (
  <Skeleton width={width} height={24} />
);

export const SkeletonButton: React.FC<{ width?: string | number }> = ({ width = 100 }) => (
  <Skeleton width={width} height={36} variant="rounded" />
);

export const SkeletonAvatar: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <Skeleton width={size} height={size} variant="circular" />
);

export const SkeletonCard: React.FC<{ width?: number; height?: number }> = ({
  width = 280,
  height = 200,
}) => <Skeleton width={width} height={height} variant="rounded" />;
