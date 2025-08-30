import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  padding-top: 10vh;
`;

export const ModalContainer = styled(motion.div)`
  position: relative;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  border-radius: 24px;
  background: white;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 8px 25px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    border-radius: 20px;
  }

  @media (max-width: 520px) {
    max-width: calc(100vw - 40px);
    width: calc(100vw - 40px);
  }
`;

export const ModalContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  max-height: 90vh;
  font-family: var(--font-nunito-sans);

`;

export const ModalCloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: #525252;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background: #e5e5e5;
    color: #1a1a1a;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.2);
  }

  @media (max-width: 768px) {
    top: 16px;
    right: 16px;
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
`;
