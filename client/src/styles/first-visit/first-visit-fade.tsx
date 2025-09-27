// src/styles/first-visit-fade.tsx
import { Global, css } from '@emotion/react';

export function FirstVisitFadeStyles() {
  return (
    <Global
      styles={css`
        :root {
          --fade-dur: 720ms;
        }
        .first-visit-overlay {
          position: fixed;
          inset: 0;
          background: #000;
          z-index: 9999;
          opacity: 1;
          pointer-events: none;
          animation: fadeOut var(--fade-dur) ease forwards;
        }
        @keyframes fadeOut {
          to {
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .first-visit-overlay {
            animation-duration: 1ms;
          }
        }
      `}
    />
  );
}
