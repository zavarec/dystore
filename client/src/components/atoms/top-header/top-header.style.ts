import Link from 'next/link';

import styled from '@emotion/styled';

export const TopHeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--top-header-h, 40px);
  background: #000000;
  color: #ffffff;
  z-index: 1100;
  border-bottom: 1px solid #333;
  padding: 24px 0;
`;

export const TopHeaderContent = styled.div`
  height: 100%;
  padding-left: 24px;
  padding-right: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin: 0 var(--page-gutter);
`;

export const TopLogo = styled(Link)`
  display: flex;
  align-items: center;
  color: #ffffff;
  text-decoration: none;
  gap: 8px;
  &:hover {
    color: #ffffff;
  }
`;

export const TopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;

  a {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    font-size: 14px;
    white-space: nowrap;
    transition: color 0.2s ease;
  }

  a:hover {
    color: rgba(255, 255, 255, 0.7);
  }

  @media (max-width: 768px) {
    gap: 14px;
    a {
      font-size: 13px;
    }
  }
`;
