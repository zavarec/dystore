import styled from '@emotion/styled';

import { media } from '@/styles/breakpoints';
import { tokens } from '@/styles/shared';

export const SpecsSection = styled.section`
  width: 100%;
  padding: 40px var(--page-gutter);
  background: #fbfbfb;
`;

export const SpecsHeader = styled.h2`
  ${tokens.typography.h2};
  margin: 0 0 24px;
  color: ${tokens.colors.palette.black};
`;

export const SpecsWrapper = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  @media (max-width: 1100px) {
    flex-direction: column;
  }

  ${media.down('tablet')} {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

export const SpecCard = styled.li`
  display: flex;
  flex-direction: column;
  padding-right: 5%;
  padding-bottom: 1.5rem;

  justify-content: space-between;
`;

export const SpecLabel = styled.div`
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 500;
  color: ${tokens.colors.semantic.text.secondary};
  letter-spacing: 0.2px;
  margin-bottom: auto;

  /* две строки максимум, остальное обрежем */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const SpecValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  border-bottom: 1px solid #eaeaea;
`;

export const SpecValue = styled.span`
  ${tokens.typography.body};
  font-size: 1.5rem;
  color: ${tokens.colors.semantic.text.primary};

  /* white-space: nowrap; */

  /* две строки максимум, остальное обрежем */
  white-space: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const SpecUnit = styled.span`
  ${tokens.typography.body};
  font-size: 1.5rem;
  color: ${tokens.colors.semantic.text.primary};
`;

export const GroupTitle = styled.h3`
  grid-column: 1 / -1;
  margin: 24px 0 4px;
  font-size: 16px;
  font-weight: 700;
  color: #444;
  letter-spacing: 0.2px;
`;

export const BottomRow = styled.div`
  margin-top: 3.75rem;
  display: grid;
  grid-template-columns: 320px 1fr 1fr; /* размеры + две фотки */
  gap: 40px;

  @media (max-width: 1100px) {
    grid-template-columns: 260px 1fr; /* одна фотка на средних экранах */
  }

  ${media.down('tablet')} {
    grid-template-columns: 1fr;
    gap: 24px;
    margin-top: 0;
  }
`;

export const DimensionsCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const DimItem = styled.div`
  padding: 12px 0 20px;
`;

export const DimensionsImageCol = styled.div`
  display: flex;
  justify-content: center;
  align-items: end;
`;

export const DimensionsImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;

  @media (max-width: 1100px) {
    max-width: 280px;
  }
  @media (max-width: 640px) {
    max-width: 220px;
    margin-inline: auto;
  }
`;
