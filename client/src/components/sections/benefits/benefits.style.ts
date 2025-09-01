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

export const BenefitsList = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`;

export const BenefitItem = styled(motion.li)`
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const BenefitContent = styled.div`
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;

  gap: 1rem;
  padding: 0.75rem 1rem;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  height: 100%;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    background: #ffffff;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
`;

export const BenefitIcon = styled.div`
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
    margin-bottom: 0.5rem;
  }
`;

export const BenefitTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: gray;
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;
