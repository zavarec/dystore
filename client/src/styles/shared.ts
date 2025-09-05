import { css } from '@emotion/react';

export const tokens = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
  },
  spacing: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
  },
  typography: {
    h1: css`
      font-size: 2.5rem;
      font-weight: 700;
      line-height: 1.2;
    `,
    body: css`
      font-size: 1rem;
      line-height: 1.6;
    `,
  },
};

export const commonStyles = {
  button: css`
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.2s ease;
    cursor: pointer;
    border: none;
  `,

  container: css`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--page-gutter);
  `,

  card: css`
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 24px;
  `,
};


