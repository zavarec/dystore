import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export const BenefitsSection = styled.section`
  flex: none;
  padding: 24px 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 2px solid #e0e0e0;

  @media (max-width: 768px) {
    padding: 16px 0;
  }

  @media (max-width: 480px) {
    padding: 12px 0;
  }
`;

export const BenefitsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BenefitsList = styled.ul<{ variant?: 'cart' | 'default' }>`
  display: grid;
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  ${({ variant }) =>
    variant === 'cart'
      ? css`
          /* Везде — вертикальный список */
          display: flex;
          flex-direction: column;
          row-gap: 0.25rem;
        `
      : css`
          /* Обычная плитка */
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;

          @media (max-width: 992px) {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
          @media (max-width: 576px) {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
        `}
`;

export const BenefitItem = styled(motion.li)<{ variant?: 'cart' | 'default' }>`
  ${({ variant }) =>
    variant === 'cart'
      ? css`
          height: 100%;
        `
      : css`
          cursor: pointer;
          transition: all 0.3s ease;
          height: 100%;

          &:hover {
            transform: translateY(-2px);
          }
        `}
`;

export const BenefitContent = styled.div<{ variant?: 'cart' | 'default' }>`
  display: flex;
  align-items: center;
  text-align: left;
  box-sizing: border-box;

  ${({ variant }) =>
    variant === 'cart'
      ? css`
          /* Вертикальный список для корзины: строка с иконкой слева и текстом справа */
          flex-direction: row;
          gap: 0;
          padding: 12px 0;
          padding-bottom: 8px;
          background: #fff;
          border: 0;
          border-bottom: 1px solid #e0e0e0;
          height: auto;

          /* Нет анимаций/эффектов */
          transition: none;
          &:hover {
            box-shadow: none;
            background: #fff;
          }

          /* Мобилка: остаёмся в одну строку, только паддинги компактней */
          @media (max-width: 768px) {
            padding: 10px 0;
            padding-bottom: 8px;
            align-items: center;
            gap: 8px;
          }
          @media (max-width: 480px) {
            padding: 10px 0;
            flex-direction: row; /* не переключаемся в колонку */
            text-align: left;
            align-items: center;
          }
        `
      : css`
          /* Карточки по умолчанию */
          flex-direction: row;
          gap: 1rem;
          padding: 0.75rem 1rem;
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 2px;
          height: 100%;

          /* Мягкий hover только для default */
          transition:
            box-shadow 0.3s ease,
            background 0.3s ease;
          &:hover {
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            background: #fff;
          }

          @media (max-width: 768px) {
            padding: 0.5rem 0.75rem;
          }
          @media (max-width: 480px) {
            padding: 0.75rem;
            flex-direction: column; /* на маленьких — колонкой */
            text-align: center;
            align-items: center;
          }
        `}
`;

export const BenefitIcon = styled.div<{ variant?: 'cart' | 'default' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  color: gray;
  flex-shrink: 0;

  @media (max-width: 768px) {
    margin-right: 0.5rem;
  }

  @media (max-width: 480px) {
    margin-right: 0;
    margin-bottom: ${({ variant }) => (variant === 'cart' ? '0' : '0.5rem')};
  }
`;

export const BenefitTitle = styled.h3<{ variant?: 'cart' | 'default' }>`
  color: gray;
  margin: 0 !important;
  line-height: 1.2;
  ${({ variant }) =>
    variant === 'cart'
      ? css`
          font-size: 1rem !important;
          font-weight: 400 !important;
        `
      : css`
          font-size: 1rem;
          font-weight: 600;

          @media (max-width: 768px) {
            font-size: 0.875rem;
          }

          @media (max-width: 480px) {
            font-size: 0.8rem;
          }
        `}
`;
