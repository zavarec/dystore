import styled from '@emotion/styled';

import { media } from '../breakpoints';
import { commonStyles, tokens } from '../shared';

const { colors } = tokens;

export const CartPageContainer = styled.div`
  ${commonStyles.container};
  padding-top: 20px;
  padding-bottom: 20px;
  min-height: 60vh;
`;

export const CartHeader = styled.div`
  margin-bottom: 20px;
  padding-left: 12px;
  ${media.down('tablet')} {
    padding-left: 0;
  }
`;

export const CartTitle = styled.h1`
  font-size: 24px;
  font-weight: 400;
  color: ${colors.semantic.text.primary};
  margin: 0;

  ${media.down('tablet')} {
    display: flex;
  }
`;

export const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const CartItem = styled.div`
  display: grid;
  display: flex;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 0.25rem;
  border: 1px solid ${tokens.colors.semantic.border.cart};
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
  width: 100%;
`;

export const ItemPiceWithQuantityWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
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
      color: ${colors.semantic.text.primary};
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
  color: ${colors.semantic.text.primary};
  margin-right: auto;
`;

export const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${colors.semantic.border.inverse};
  border-radius: 6.25rem;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #fff;
`;

export const QuantityButton = styled.button`
  padding: 0.5rem;
  border: none;
  color: #666;
  background-color: #fff;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    color: ${colors.semantic.text.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const RemoveButton = styled.button`
  width: 40px;
  height: 40px;

  border: 1px solid ${colors.semantic.border.cart};
  border-radius: 2px;
  background: white;
  color: ${colors.semantic.state.danger};
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
  &:hover:not(:disabled) {
    border-color: ${colors.semantic.border.input};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CartSummary = styled.div`
  background: ${colors.semantic.background.secondary};
  border-radius: 0.25rem;
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
  background: ${colors.semantic.text.primary};
  color: white;
  font-size: 16px;
  display: inline-block;

  &:hover {
    background: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  }
`;
export const CartContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  padding-left: 16px;

  ${media.down('tablet')} {
    grid-template-columns: 1fr;
    padding-left: 0;
    gap: 20px;
  }
`;

// правая колонка — обёртка “Итого”, чтобы тянуться на мобиле
export const CartSummaryCol = styled.div`
  display: flex;
  flex-direction: column;
`;

// форма адреса/коммента
export const CartAddressForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

export const CartField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const CartFieldLabel = styled.span`
  font-size: 14px;
  line-height: 1.2;
  color: #111827;
`;

const baseInput = `
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  font-size: 14px;
  outline: none;
  width: 100%;

  &:disabled { opacity: .6; }
`;

export const CartTextInput = styled.input`
  ${baseInput}
`;

export const CartTextArea = styled.textarea`
  ${baseInput}
  resize: vertical;
`;

// блок под кнопку “Продолжить покупки”
export const ContinueCartActions = styled.div`
  margin-top: 16px;
`;

// мелкие адаптив-штрихи для карточек (если нужно)
export const CartItemResponsive = styled.div`
  display: contents;

  ${media.down('tablet')} {
    /* на мобильном чуть компактнее */
    .item-image {
      width: 96px;
      height: 96px;
    }
  }
`;
