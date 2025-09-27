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

export const Media = styled.div`
  position: relative;
  width: 100%;
  padding-top: var(--mh-ratio, 66%); /* управляемое ratio */
  border: 1px solid #e0e0e0;
  overflow: hidden;

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

// machine-highlights-section.style.ts
export const Grid = styled.div`
  display: grid;
  gap: clamp(28px, 3vw, 36px);
  grid-auto-flow: dense;

  /* 1 колонка на мобилке */
  grid-template-columns: repeat(4, minmax(0, 1fr)); /* = 4 юнита на sm */

  @media (min-width: 768px) {
    grid-template-columns: repeat(8, minmax(0, 1fr)); /* md = 8 юнитов */
  }
  @media (min-width: 1100px) {
    grid-template-columns: repeat(12, minmax(0, 1fr)); /* lg = 12 юнитов */
  }
`;

/* Карточка умеет “растягиваться” на N юнитов */
export const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: 14px;

  /* по умолчанию — во всю строку на sm */
  grid-column: span var(--span-sm, 4) / auto;

  @media (min-width: 768px) {
    grid-column: span var(--span-md, 4) / auto; /* 8 юнитов -> 4 == половина (2 в ряд) */
  }
  @media (min-width: 1100px) {
    grid-column: span var(--span-lg, 4) / auto; /* 12 юнитов -> 4 == треть (3 в ряд) */
  }
`;
