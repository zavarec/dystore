import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

// Анимация для скелетона
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

export const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  padding: 10px 0;
  justify-items: center;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const CategorySkeletonCard = styled.div`
  min-width: 280px;
  width: 280px;
  height: 350px;
  background-color: #e9ecef;
  border-radius: 24px;
  animation: ${pulseAnimation} 2s ease-in-out infinite;

  @media (max-width: 768px) {
    min-width: 240px;
    width: 240px;
    height: 300px;
  }

  @media (max-width: 480px) {
    min-width: 200px;
    width: 200px;
    height: 260px;
  }
`;
