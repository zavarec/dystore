import styled from '@emotion/styled';

/* ================= styles ================= */

export const Section = styled.section`
  display: grid;
  gap: clamp(12px, 1.8vw, 20px);
  color: #111827;

  .visually-hidden {
    position: absolute !important;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    clip: rect(0 0 0 0);
    overflow: hidden;
    white-space: nowrap;
  }
`;

export const Note = styled.p`
  margin: 0;
  font-size: clamp(14px, 1.4vw, 16px);
  line-height: 1.5;
  color: #4b5563; /* нейтральный серый */
`;

export const List = styled.ul<{ compact: boolean }>`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: ${({ compact }) => (compact ? '8px' : '12px')};

  @media (min-width: 960px) {
    gap: ${({ compact }) => (compact ? '10px' : '14px')};
  }
`;

export const Li = styled.li`
  position: relative;
  padding-left: 1.25em;
  font-size: clamp(16px, 1.6vw, 18px);
  line-height: 1.55;

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    top: 0.1em;
    font-size: 1.2em;
    line-height: 1;
  }

  .text {
    word-break: break-word;
  }

  .footnote {
    margin-left: 2px;
    font-size: 0.75em;
    vertical-align: super;
  }
`;

export const Footnotes = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  color: #6b7280;
  font-size: clamp(12px, 1.2vw, 13px);
  display: grid;
  gap: 6px;

  li {
    line-height: 1.4;
  }
`;
