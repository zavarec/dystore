import styled from '@emotion/styled';

export const Wrap = styled.section<{ bg?: string }>`
  position: relative;
  width: 100%;
  overflow: hidden;
  background: ${({ bg }) => bg || 'transparent'};
`;

export const Viewport = styled.div`
  position: relative;
  width: 100%;
  height: 520px;
`;

export const Slides = styled.div<{ $index: number }>`
  display: flex;
  height: 100%;
  transform: translateX(${({ $index }) => `-${$index * 100}%`});
  transition: transform 450ms ease;
`;

export const Slide = styled.div`
  min-width: 100%;
  height: 100%;
  position: relative;
`;

export const Media = styled.div`
  position: absolute;
  z-index: 1;
  inset: 0;

  > img,
  > video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const Overlay = styled.div<{ align?: 'left' | 'right' | 'center' }>`
  position: relative;
  z-index: 2;
  height: 100%;
  display: grid;
  align-items: center;
  padding: 24px;

  @media (min-width: 960px) {
    padding: 32px 40px;
  }

  > div {
    max-width: 720px;
    margin-left: ${({ align }) =>
      align === 'right' ? 'auto' : align === 'center' ? 'auto' : '4rem'};
    margin-right: ${({ align }) =>
      align === 'left' ? 'auto' : align === 'center' ? 'auto' : '4rem'};
    text-align: ${({ align }) => (align === 'center' ? 'center' : 'left')};
    color: #fff;
    text-shadow: 0 2px 16px rgba(0, 0, 0, 0.35);
  }
`;

export const Grad = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.35),
    rgba(0, 0, 0, 0.2) 40%,
    rgba(0, 0, 0, 0.45)
  );
`;

export const Dots = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 14px;
  z-index: 3;
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
`;

export const Dot = styled.button<{ $active?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: ${({ $active }) => ($active ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)')};
  transform: ${({ $active }) => ($active ? 'scale(1.5)' : 'none')};
`;

export const Arrow = styled.button<{ side: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ side }) => (side === 'left' ? 'left: 8px;' : 'right: 8px;')}
  z-index: 3;

  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  color: black;
  font-size: 18px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.4);

  &:hover {
    background: rgba(255, 255, 255, 0.6);
  }
`;

export const Title = styled.h3<{
  $color?: string;
  $fontSize?: string;
  $fontWeight?: string | number;
  $lineHeight?: string;
  $margin?: string;
}>`
  font-size: ${({ $fontSize }) => $fontSize || '28px'};
  line-height: ${({ $lineHeight }) => $lineHeight || '1.2'};
  margin: ${({ $margin }) => $margin || '0 0 8px'};
  color: ${({ $color }) => $color || 'inherit'};
  font-weight: ${({ $fontWeight }) => $fontWeight || 'inherit'};
`;

export const Subtitle = styled.p<{
  $color?: string;
  $fontSize?: string;
  $fontWeight?: string | number;
  $lineHeight?: string;
  $margin?: string;
  $opacity?: number;
}>`
  font-size: ${({ $fontSize }) => $fontSize || '16px'};
  line-height: ${({ $lineHeight }) => $lineHeight || '1.5'};
  margin: ${({ $margin }) => $margin || '0 0 12px'};
  color: ${({ $color }) => $color || 'inherit'};
  font-weight: ${({ $fontWeight }) => $fontWeight || 'inherit'};
  opacity: ${({ $opacity }) => $opacity || '0.95'};
`;
