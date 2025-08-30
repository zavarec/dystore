import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export const CategoryCardBox = styled.div<{ variant?: 'tall' | 'square' }>`
  ${props =>
    props.variant === 'square'
      ? `
    width: 260px;
    min-width: 240px;
  `
      : `
    min-width: 260px;
    width: 280px;
  `}
`;

export const CategoryCardWrapper = styled(motion.div)<{ variant?: 'tall' | 'square' }>`
  /* размеры зависят от варианта */
  ${props =>
    props.variant === 'square'
      ? `
    width: 260px;
    height: 260px;
    min-width: 240px;
    border-radius: 16px;
  `
      : `
    min-width: 260px;
    width: 280px;
    height: 350px;
  border-radius: 24px;

  `}
  background: white;
  overflow: hidden; // было: hidden

  cursor: pointer;
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
    border-color: rgb(74, 74, 74);
    transform: none;
  }

  @media (max-width: 768px) {
    ${props =>
      props.variant === 'square'
        ? `
      width: 220px;
      height: 220px;
      min-width: 200px;
    `
        : `
      min-width: 240px;
      width: 240px;
      height: 300px;
    `}
  }

  @media (max-width: 480px) {
    ${props =>
      props.variant === 'square'
        ? `
      width: 200px;
      height: 200px;
      min-width: 180px;
    `
        : `
      min-width: 200px;
      width: 200px;
      height: 260px;
    `}
  }
`;

export const CategoryImage = styled.img<{ variant?: 'tall' | 'square' }>`
  width: 100%;
  object-fit: cover;
  ${props => (props.variant === 'square' ? `height: 100%;` : `height: 280px;`)}

  @media (max-width: 768px) {
    ${props => (props.variant === 'square' ? `height: 100%;` : `height: 240px;`)}
  }

  @media (max-width: 480px) {
    ${props => (props.variant === 'square' ? `height: 100%;` : `height: 200px;`)}
  }
`;

export const CategoryName = styled.h3<{ variant?: 'tall' | 'square' }>`
  font-size: 1.2rem;
  font-weight: 600;
  color: #212529;
  margin: 4px 0 0;
  text-align: left;
  line-height: 1.4;
  position: static;
  padding: 0;
  background: transparent;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 12px 16px;
  }
`;
