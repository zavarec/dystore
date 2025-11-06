import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export const ModalOverlay = styled(motion.div)<{
  $alignStart?: boolean;
  $scrollStrategy?: 'content' | 'page' | 'modal' | undefined;
}>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: saturate(140%) blur(2px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: ${({ $alignStart, $scrollStrategy }) =>
    $scrollStrategy === 'modal' ? 'flex-start' : $alignStart ? 'flex-end' : 'center'};
  padding: 16px;
  min-height: 100vh;
  overscroll-behavior: contain;

  ${({ $scrollStrategy }) =>
    $scrollStrategy === 'modal'
      ? `
        padding-top: clamp(48px, 10vh, 120px);
        overflow-y: auto;
      `
      : ''}
`;
const sizeToMaxWidth: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
  sm: '420px',
  md: '560px',
  lg: '720px',
  xl: '960px',
};

export const ModalContainer = styled(motion.div)<{
  $size: 'sm' | 'md' | 'lg' | 'xl';
  $maxWidth?: string;
  $isSheet?: boolean;
  $fullHeight: boolean | undefined;
  $scrollStrategy?: 'content' | 'page' | 'modal' | undefined;
}>`
  position: relative;
  width: 100%;
  max-width: ${({ $maxWidth, $size }) => $maxWidth ?? sizeToMaxWidth[$size]};
  /* полноэкранная высота для 'modal' или когда явно включили fullHeight */
  ${({ $scrollStrategy, $fullHeight }) =>
    $scrollStrategy === 'modal'
      ? `
        height: auto;
        min-height: auto;
        flex: 0 1 auto;
      `
      : $fullHeight
        ? 'height: 100vh; max-height: none;'
        : 'max-height: 85vh;'}
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow:
    0 24px 80px rgba(0, 0, 0, 0.28),
    0 8px 28px rgba(0, 0, 0, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 22px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

export const ModalTitle = styled.h3`
  margin: 0;
  flex: 1;
  font-family: var(--font-nunito-sans);
  font-weight: 700;
  font-size: 20px;
  line-height: 1.2;
  color: #1a1a1a;
`;

export const ModalCloseButton = styled.button`
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  background: #f5f5f5;
  color: #525252;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    color 0.18s ease;
  &:hover {
    background: #e9e9e9;
    color: #1a1a1a;
    transform: scale(1.06);
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.2);
  }
`;

export const ModalContent = styled.div<{
  $padding: number;
  $scrollStrategy: 'content' | 'page' | 'modal' | undefined;
  $hasHeader?: boolean;
}>`
  padding: ${({ $padding }) => `${$padding}px`};
  font-family: var(--font-nunito-sans);
  font-size: 16px;
  line-height: 1.55;
  color: #2b2b2b;

  ${({ $scrollStrategy, $hasHeader }) =>
    $scrollStrategy === 'modal'
      ? `
        /* скроллим только контент модалки, фон зафиксирован */
        flex: 1 1 auto;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;      /* не протекаем на фон */
        overscroll-behavior-y: contain;
        touch-action: pan-y;
        max-height: 100%;                  /* вся доступная высота контейнера */
      `
      : $scrollStrategy === 'page'
        ? `
        /* для page — без внутреннего скролла */
        overflow: visible;
        max-height: none;
        flex: 1 1 auto;
      `
        : `
        /* старый content-режим с ограничением по высоте */
        overflow: auto;
        max-height: calc(85vh - ${$hasHeader ? 62 : 0}px);
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      `}

  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE и старый Edge */
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none; /* Chrome, Safari */
  }
`;
