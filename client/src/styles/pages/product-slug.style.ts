import styled from '@emotion/styled';
import { tokens, commonStyles } from '../shared';

export const ProductPageContainer = styled.div`
  ${commonStyles.container};
  padding: 40px 20px;
`;

export const ProductBreadcrumbs = styled.nav`
  margin-bottom: 32px;
  font-size: 14px;
  color: #666;

  a {
    color: ${tokens.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #0056b3;
      text-decoration: underline;
    }
  }
`;

export const BreadcrumbLink = styled.a`
  color: ${tokens.colors.primary};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #0056b3;
    text-decoration: underline;
  }
`;

export const ProductImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ProductMainImage = styled.div`
  width: 100%;
  height: 600px;
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e5e5;
`;

export const ProductThumbnails = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ThumbnailImage = styled.div`
  width: 80px;
  height: 80px;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: ${tokens.colors.primary};
  }
`;

export const ProductInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ProductTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;
  margin: 0;
`;

export const ProductDescription = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

export const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const CurrentPrice = styled.span`
  font-size: 32px;
  font-weight: 700;
  color: ${tokens.colors.primary};
`;

export const OriginalPrice = styled.span`
  font-size: 24px;
  color: #999;
  text-decoration: line-through;
`;

export const DiscountBadge = styled.span`
  background: ${tokens.colors.danger};
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
`;

export const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Stars = styled.span`
  color: #ffc107;
  font-size: 20px;
`;

export const ReviewsCount = styled.span`
  color: #666;
  font-size: 14px;
`;

export const ProductFeatures = styled.div`
  h3 {
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 16px 0;
  }
`;

export const FeatureItem = styled.div`
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.5;
`;

export const ProductSpecs = styled.div`
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid #e5e5e5;
`;

export const SpecsTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 24px 0;
`;

export const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

export const SpecItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
`;

export const SpecName = styled.span`
  font-weight: 600;
  color: #1a1a1a;
`;

export const SpecValue = styled.span`
  color: #666;
  font-weight: 500;
`;

export const ProductActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InStockBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: #d4edda;
  color: #155724;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  width: fit-content;
`;

export const OutOfStockBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  width: fit-content;
`;

// Медиа-запросы для адаптивности
export const MediaQueries = {
  mobile: '@media (max-width: 768px)',
  tablet: '@media (max-width: 1024px)',
};

// Адаптивные стили
export const ResponsiveProductPage = `
  ${MediaQueries.tablet} {
    ${ProductPageContainer} {
      padding: 20px 16px;
      
      > div {
        grid-template-columns: 1fr !important;
        gap: 32px !important;
      }
    }
    
    ${ProductMainImage} {
      height: 400px;
    }
    
    ${ProductTitle} {
      font-size: 28px;
    }
    
    ${CurrentPrice} {
      font-size: 28px;
    }
  }
  
  ${MediaQueries.mobile} {
    ${ProductTitle} {
      font-size: 24px;
    }
    
    ${CurrentPrice} {
      font-size: 24px;
    }
    
    ${OriginalPrice} {
      font-size: 18px;
    }
    
    ${ProductMainImage} {
      height: 300px;
    }
    
    ${SpecsGrid} {
      grid-template-columns: 1fr;
    }
  }
`;
