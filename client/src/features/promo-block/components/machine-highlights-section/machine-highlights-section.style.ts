import styled from '@emotion/styled';

import { commonStyles } from '@/styles/shared';

export const Section = styled.section<{ $bg?: string; sectionBorder: boolean }>`
  ${commonStyles.container};
  width: 100%;
  background: ${({ $bg }) => $bg || '#fff'};
  color: #111827;
  padding-top: 2rem;
  border: ${({ sectionBorder }) => sectionBorder && '1px solid #e0e0e0'};
`;

export const Wrapper = styled.div`
  // max-width: 1240px;
  // margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(32px, 4vw, 56px);
`;

export const Heading = styled.header<{ $color?: string | undefined }>`
  display: flex;
  flex-direction: column;
  gap: 16px;

  h2 {
    margin: 0;
    font-size: clamp(28px, 3.2vw, 40px);
    line-height: 1.2;
    font-weight: 600;
    color: ${({ $color }) => $color || '#111827'};
  }

  p {
    margin: 0;
    font-size: clamp(16px, 2vw, 18px);
    line-height: 1.55;
    color: rgba(55, 65, 81, 0.88);
  }
`;

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: clamp(18px, 2vw, 20px);
  font-weight: 600;
`;

export const CardDescription = styled.p`
  margin: 0;
  color: rgba(55, 65, 81, 0.88);
  line-height: 1.6;
  font-size: 15px;
`;

export const CardCta = styled.a`
  margin-top: auto;
  display: inline-flex;
  gap: 6px;
  align-items: center;
  font-weight: 600;
  color: #0ea5e9;
  text-decoration: none;
  font-size: 15px;

  &:hover {
    text-decoration: underline;
  }
`;

// machine-highlights-section.style.ts
export const Grid = styled.div<{ $variant: 'grid' | 'row' }>`
  display: grid;
  gap: clamp(28px, 3vw, 36px);

  /* GRID режим: 1/2/4 (или заданные в JSON) */
  ${({ $variant }) =>
    $variant === 'grid'
      ? `
    grid-template-columns: repeat(var(--mh-cols-sm, 1), minmax(0, 1fr));
    @media (min-width: 768px) {
      grid-template-columns: repeat(var(--mh-cols-md, 2), minmax(0, 1fr));
    }
    @media (min-width: 1100px) {
      grid-template-columns: repeat(var(--mh-cols-lg, 4), minmax(0, 1fr));
    }
  `
      : `
    /* ROW режим: крупные карточки в ряд (1 / 2 / 2) */
    grid-template-columns: 1fr;
    @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
    @media (min-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  `}
`;

export const Media = styled.div`
  position: relative;
  width: 100%;
  padding-top: var(--mh-ratio, 66%); /* управляемое ratio */
  border: 1px solid #e0e0e0;
  overflow: hidden;
  background: #f1f5f9;

  > img,
  > video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: var(--mh-fit, cover); /* cover/contain из JSON */
    display: block;
  }
`;
