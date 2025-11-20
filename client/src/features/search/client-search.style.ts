import { tokens } from '@/styles/shared';
import styled from '@emotion/styled';

export const ClientSearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const MobileActions = styled.div`
  display: none;
  @media (max-width: 1100px) {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

export const IconButton = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;

  color: #ffffff;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    transform 0.05s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.35);
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const ResultsDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  z-index: 2000; /* перекрываем инпут/иконки поверх */
  margin-top: 8px;
  border-radius: 8px;
  background: #0f0f10;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  max-height: 60vh; /* ограничиваем высоту выпадающего списка */
  overflow-y: auto; /* скроллим только список */
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  width: fit-content;

  @media (max-width: 1100px) {
    max-height: 70vh;
  }
`;

export const ResultItem = styled.a`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 10px 16px; /* немного больше справа, чтобы цена не упиралась */
  color: rgba(255, 255, 255, 0.95);
  text-decoration: none;
  transition: background 0.15s ease;
  border: 1px solid ${tokens.colors.semantic.text.primary};

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  .title {
    font-size: 14px;
    line-height: 1.3;
  }

  .price {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    white-space: nowrap;
  }
`;

export const EmptyState = styled.div`
  padding: 12px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
`;

export const SearchIconWrap = styled.span<{ $mobileOpen: boolean }>`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  pointer-events: none;
  color: #111; /* чёрная иконка на светлом инпуте */
  opacity: 0.9;

  @media (max-width: 1100px) {
    display: ${props => (props.$mobileOpen ? 'inline-flex' : 'none')};
  }

  @media (min-width: 1101px) {
    display: inline-flex;
  }
`;
