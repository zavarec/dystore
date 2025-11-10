import Image from 'next/image';

import styled from '@emotion/styled';

export const BannerContainer = styled.section<{
  height?: string | number;
}>`
  position: relative;
  width: 100%;
  overflow: hidden;
  color: white;
  background: #000;
  height: ${({ height }) => (typeof height === 'number' ? `${height}px` : height || '60vh')};
  min-height: 300px;

  @media (max-width: 768px) {
    min-height: 260px;
    height: ${({ height }) =>
      height ? (typeof height === 'number' ? `${height}px` : height) : '50vh'};
  }
`;

export const BackgroundImageWrapper = styled.div<{ isVisible: boolean }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transition: opacity 0.6s ease;
  pointer-events: none;
  z-index: 0;
`;

export const BackgroundImage = styled(Image)`
  object-fit: cover;
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
`;

export const VideoWrapper = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const Content = styled.div<{ align?: 'left' | 'center' | 'right' }>`
  position: relative;
  z-index: 3;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: ${({ align }) =>
    align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'};
  justify-content: center;
  padding: 0 20px;
  text-align: ${({ align }) => align || 'center'};
`;

export const ToggleButton = styled.button`
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 4;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    display: block;
  }
`;

export const LoaderWrapper = styled.div`
  position: absolute;
  inset: 0;
  background: #000; /* или градиент, как у Dyson */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;
