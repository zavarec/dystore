import styled from '@emotion/styled';

export const CartButtonContainer = styled.button`
  background: transparent;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 50%;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    padding: 8px;
    font-size: 16px;
  }

  svg {
    display: block;
    fill: currentColor;
  }
`;

export const CartBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background: #79b928;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;
