import styled from '@emotion/styled';
import { commonStyles, tokens } from '../shared';

export const CartPageContainer = styled.div`
  ${commonStyles.container};
  padding: 40px 20px;
  min-height: 60vh;
`;

export const CartHeader = styled.div`
  margin-bottom: 40px;
`;

export const CartTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

export const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const CartItem = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr auto auto;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: #007bff;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
  }
`;

export const ItemImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ItemName = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${tokens.colors.primary};
    }
  }
`;

export const ItemDescription = styled.div`
  font-size: 14px;
  color: #666;
  line-height: 1.4;
`;

export const ItemPrice = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${tokens.colors.primary};
`;

export const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
`;

export const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: #f8f9fa;
  color: #666;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: #e9ecef;
    color: ${tokens.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const QuantityInput = styled.input`
  width: 60px;
  height: 40px;
  border: none;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  background: white;

  &:focus {
    outline: none;
  }

  /* Скрываем стрелки у input type="number" */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

export const RemoveButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid ${tokens.colors.danger};
  background: white;
  color: ${tokens.colors.danger};
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: ${tokens.colors.danger};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CartSummary = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 100px;

  h3 {
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 20px 0;
  }
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 16px;
  color: #666;

  &:last-of-type {
    border-bottom: none;
  }
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-top: 2px solid #e5e5e5;
  margin-top: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
`;

export const CheckoutSection = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const EmptyCart = styled.div`
  text-align: center;
  padding: 80px 20px;
  max-width: 500px;
  margin: 0 auto;
`;

export const EmptyCartIcon = styled.div`
  font-size: 80px;
  margin-bottom: 24px;
  opacity: 0.5;
`;

export const EmptyCartTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px 0;
`;

export const EmptyCartDescription = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 32px 0;
`;

export const ContinueShoppingButton = styled.button`
  ${commonStyles.button};
  background: ${tokens.colors.primary};
  color: white;
  font-size: 16px;
  display: inline-block;

  &:hover {
    background: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  }
`;

// Медиа-запросы для адаптивности
export const mediaQueries = {
  mobile: '@media (max-width: 768px)',
  tablet: '@media (max-width: 1024px)',
};

// Добавляем стили для мобильных устройств
export const responsiveStyles = `
  ${mediaQueries.mobile} {
    ${CartItem} {
      grid-template-columns: 80px 1fr;
      grid-template-rows: auto auto;
      gap: 12px;
    }
    
    ${QuantityControls} {
      grid-column: 1 / -1;
      justify-self: start;
    }
    
    ${RemoveButton} {
      position: absolute;
      top: 12px;
      right: 12px;
    }
  }
  
  ${mediaQueries.tablet} {
    ${CartPageContainer} > div {
      grid-template-columns: 1fr !important;
      gap: 30px !important;
    }
    
    ${CartSummary} {
      position: static;
    }
  }
`;
