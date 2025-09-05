// modal.style.ts
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export const ModalOverlay = styled(motion.div)<{ $alignStart?: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: saturate(140%) blur(2px);
  display: flex;
  align-items: ${({ $alignStart }) => ($alignStart ? 'flex-end' : 'center')};
  justify-content: center;
  z-index: 1000;
  padding: 16px;
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
}>`
  position: relative;
  width: 100%;
  max-width: ${({ $maxWidth, $size }) => $maxWidth ?? sizeToMaxWidth[$size]};
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  border-radius: ${({ $isSheet }) => ($isSheet ? '20px 20px 16px 16px' : '24px')};
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow:
    0 24px 80px rgba(0, 0, 0, 0.28),
    0 8px 28px rgba(0, 0, 0, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
  overflow: hidden;

  @media (max-width: 520px) {
    max-width: 100%;
    ${({ $isSheet }) =>
      $isSheet
        ? `
      border-radius: 20px 20px 0 0;
      max-height: 92vh;
    `
        : ''}
  }
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

export const ModalContent = styled.div<{ $padding: number }>`
  padding: ${({ $padding }) => `${$padding}px`};
  overflow: auto;
  max-height: calc(85vh - 62px);
  font-family: var(--font-nunito-sans);
  font-size: 16px;
  line-height: 1.55;
  color: #2b2b2b;
  p {
    margin: 0 0 12px;
  }
`;
