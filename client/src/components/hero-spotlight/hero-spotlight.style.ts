import styled from '@emotion/styled';

export const Title = styled.h2`
  font-size: 36px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 16px;
`;

export const Subtitle = styled.p`
  font-size: 18px;
  max-width: 640px;
  margin: 0 0 24px;
  color: rgba(255, 255, 255, 0.86);
`;

export const Button = styled.a`
  display: inline-block;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  background: #82e635ff;
  color: #111;
  transition: background 0.2s ease;
  &:hover {
    background: #9ebe3dff;
  }
`;
export const MotifWrap = styled.div<{ pos: MotifPos }>`
  position: absolute;
  z-index: 2;
  ${({ pos }) =>
    pos === 'top-left'
      ? 'top:24px; left:24px;'
      : pos === 'top-right'
        ? 'top:24px; right:24px;'
        : pos === 'bottom-left'
          ? 'bottom:24px; left:24px;'
          : 'bottom:24px; right:24px;'}
  pointer-events: none; /* лого не кликабельно; убери, если нужен клик */
  img {
    display: block;
    max-width: 100%;
    height: auto;
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.25));
  }
`;

export const Section = styled.section<{ bgImage: string }>`
  position: relative;
  width: 100%;
  min-height: 480px;
  display: flex;
  align-items: center;
  background: ${({ bgImage }) => `url(${bgImage}) center/cover no-repeat`};
  color: #fff;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.5) 40%,
      transparent 100%
    );
  }
`;

export const Container = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1240px;
  margin: 0 auto;
  padding: 64px 24px;
`;
