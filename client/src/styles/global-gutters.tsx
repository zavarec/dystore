// styles/globals-gutters.tsx
import { Global, css } from '@emotion/react';

export function GlobalGutters() {
  return (
    <Global
      styles={css`
        :root {
          /* адаптивный gutter: 16px → 70px */
          --page-gutter: clamp(16px, 5vw, 70px);
          --top-header-h: 40px;
          /* общий отступ сверху под оба хедера */
          --header-h: 118px; /* 40 + 78 */
          /* мобильная/планшетная точка совпадает с брейкпоинтом хедера */
          @media (max-width: 1100px) {
            :root {
              --top-header-h: 0px; /* один хеддер */
              --header-h: 68px; /* высота контента 60px + внутренний отступ 8px */
            }
          }
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
