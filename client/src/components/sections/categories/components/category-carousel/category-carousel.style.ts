import styled from '@emotion/styled';

export const CarouselWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const CarouselContainer = styled.div`
  flex: 1;
  overflow: hidden;
  border-radius: 12px;
`;

export const CarouselTrack = styled.div`
  display: flex;
  gap: 24px;
  padding: 10px 10px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

export const CarouselButton = styled.button<{
  direction: 'left' | 'right';
  disabled: boolean;
}>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #007bff;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: #007bff;
    color: white;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;
