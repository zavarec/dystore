import styled from '@emotion/styled';

export const AddToCartButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

export const QuantityBadge = styled.span`
  position: absolute;
  top: -8px;
  right: 8px;
  background: #ff6b35;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;
