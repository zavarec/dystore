import styled from '@emotion/styled';

export const ClientSearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const ResultsDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  z-index: 1200;
  margin-top: 8px;
  border-radius: 8px;
  background: #0f0f10;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  overflow: hidden;
`;

export const ResultItem = styled.a`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  color: rgba(255, 255, 255, 0.95);
  text-decoration: none;
  transition: background 0.15s ease;

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
