// styles/globals-gutters.tsx
import { Global, css } from '@emotion/react';

export function GlobalGutters() {
  return (
    <Global
      styles={css`
        :root {
          /* адаптивный gutter: 16px → 70px */
          --page-gutter: clamp(16px, 5vw, 70px);
        }
        /* чтобы не ловить горизонтальный скролл */
        html,
        body {
          width: 100%;
          overflow-x: hidden;
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
      `}
    />
  );
}
