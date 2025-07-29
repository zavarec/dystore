import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const CarouselSlide = styled(motion.div)<{ background?: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ background }) =>
    background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
    z-index: 1;
  }
`;

export const CarouselContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 24px;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 2.5rem;
      margin-bottom: 16px;
    }

    @media (max-width: 480px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.25rem;
    margin-bottom: 32px;
    opacity: 0.9;
    line-height: 1.6;

    @media (max-width: 768px) {
      font-size: 1.1rem;
      margin-bottom: 24px;
    }

    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
`;

export const CarouselIndicators = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 3;

  @media (max-width: 768px) {
    bottom: 20px;
    gap: 8px;
  }
`;

export const CarouselIndicator = styled.button<{ active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: ${({ active }) => (active ? 'rgba(255, 255, 255, 0.9)' : 'transparent')};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.7);
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
  }
`;
