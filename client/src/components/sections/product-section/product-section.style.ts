import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export const Section = styled.section`
  margin-bottom: 80px;

  @media (max-width: 768px) {
    margin-bottom: 60px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 48px;
  color: #333;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 32px;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 24px;
  }
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
  justify-items: center;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 32px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

export const ProductCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.1s ease;
  border: 1px solid #f0f0f0;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

export const ProductImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;

  @media (max-width: 480px) {
    height: 160px;
    font-size: 3rem;
  }
`;

export const ProductInfo = styled.div`
  padding: 24px;

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

export const ProductName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  line-height: 1.4;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

export const ProductDescription = styled.p`
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
  font-size: 0.9rem;

  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-bottom: 12px;
  }
`;

export const ProductPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #000000;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    font-size: 1.3rem;
    margin-bottom: 16px;
  }
`;
