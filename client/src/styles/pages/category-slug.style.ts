import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { commonStyles, tokens } from '../shared';

export const Container = styled.div`
  ${commonStyles.container};
  padding: 40px 20px;
`;

export const Header = styled.section`
  text-align: center;
  margin-bottom: 60px;
`;

export const CategoryTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #333;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const CategoryDescription = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

export const FiltersBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

export const FilterLabel = styled.label`
  font-weight: 600;
  color: #333;
  margin-right: 8px;
`;

export const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${tokens.colors.primary};
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

export const ProductsCount = styled.div`
  color: #666;
  font-size: 14px;
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
`;

export const ProductCard = styled(motion.div)`
  ${commonStyles.card};
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

export const ProductImage = styled.div`
  height: 250px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #6c757d;
  position: relative;
`;

export const ProductBadge = styled.div<{ type: 'new' | 'popular' | 'sale' }>`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background: ${props => {
    switch (props.type) {
      case 'new':
        return tokens.colors.success;
      case 'popular':
        return tokens.colors.primary;
      case 'sale':
        return tokens.colors.danger;
      default:
        return '#6c757d';
    }
  }};
`;

export const ProductInfo = styled.div`
  padding: 24px;
`;

export const ProductName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  line-height: 1.3;
`;

export const ProductDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 16px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

export const CurrentPrice = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #000000;
`;

export const OriginalPrice = styled.span`
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
`;

export const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #666;
`;

export const Stars = styled.span`
  color: #ffc107;
`;

export const LoadMoreSection = styled.div`
  text-align: center;
  margin-top: 40px;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #666;
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
`;

export const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 12px;
  color: #333;
`;

export const EmptyDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 24px;
`;
