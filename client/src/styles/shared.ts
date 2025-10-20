import { css } from '@emotion/react';

export const tokens = {
  colors: {
    palette: {
      black: '#000000',
      white: '#FFFFFF',
      gray: {
        100: '#F9F9F9',
        200: '#ECECEC',
        300: '#CCCCCC',
        400: '#999999',
        500: '#666666',
        600: '#333333',
        700: '#1A1A1A',
      },
      green: '#28a745',
      red: '#dc3545',
      yellow: '#ffc107',
      blue: '#17a2b8',
    },

    semantic: {
      text: {
        primary: '#333333',
        secondary: '#555555',
        inverse: '#FFFFFF',
        muted: '#999999',
      },
      background: {
        primary: '#FFFFFF',
        secondary: '#FBFBFB',
        surface: '#F5F5F5',
        inverse: '#242424',
      },
      border: {
        default: '#E0E0E0',
        strong: '#BDBDBD',
        inverse: '#444444',
      },
      state: {
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
      },
    },

    components: {
      button: {
        primary: {
          bg: '#333333',
          text: '#FFFFFF',
          hover: '#111111',
        },
        secondary: {
          bg: '#ECECEC',
          text: '#111111',
          hover: '#CCCCCC',
        },
      },
      dropdown: {
        bg: '#242424',
        border: '#E0E0E0',
        itemHover: '#F7F7F7',
      },
      footerBar: {
        bg: '#242424',
        text: '#FFFFFF',
      },
    },
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
      font-family: var(--font-nunito-sans);
    `,
    h2: css`
      font-size: 2rem;
      font-weight: 300;
      line-height: 1.25;
      font-family: var(--font-nunito-sans);
    `,
    body: css`
      font-size: 1rem;
      line-height: 1.6;
      font-family: var(--font-nunito-sans);
    `,

    bodySm: css`
      font-size: 16px;
      line-height: 1.5;
      font-family: var(--font-nunito-sans);
      color: #555555;
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
    /* max-width: 1200px; */
    /* margin: 0 auto; */
    padding: 0 var(--page-gutter);
  `,

  card: css`
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 24px;
  `,
};
