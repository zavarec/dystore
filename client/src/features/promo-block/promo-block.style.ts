import styled from '@emotion/styled';
import { PromoFont } from '@/types/models/promo-section.model';
import { fontFamilyMap } from '@/constants/fonts.constants';

type CardProps = {
  $text?: string | null;
  $title?: string | null;
  $font?: PromoFont | null;
  $bg?: string | null;
};

export const Card = styled.section<CardProps>`
  padding: 12px;
  padding-left: 70px;
  background: ${({ $bg }) => $bg || '#fff'};
  color: ${({ $text }) => $text || 'inherit'};
  font-family: ${({ $font }) => fontFamilyMap[$font || 'DEFAULT']};
  h3 {
    margin: 0 0 8px 0;
    color: ${({ $title }) => $title || 'inherit'};
  }
`;

export const Media = styled.div`
  border-radius: 8px;
  overflow: hidden;
  background: #f6f7f8;
  img,
  video {
    display: block;
    width: 100%;
    height: auto;
  }
`;

export const CtaRow = styled.div<{ $align?: 'left' | 'center' | 'right' }>`
  margin-top: 10px;
  display: flex;
  justify-content: ${({ $align }) => $align || 'left'};
`;

export const CtaBtn = styled.a<{ $bg?: string | null; $color?: string | null }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  border: 1px solid ${({ $bg }) => $bg || '#111827'};
  background: ${({ $bg }) => $bg || '#111827'};
  color: ${({ $color }) => $color || '#fff'};
  transition: filter 0.15s ease;
  &:hover {
    filter: brightness(0.96);
  }
`;

/** GRID — простая сетка превью (можно расширить позже) */
export const GridWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
`;

/** STRIP_USP — горизонтальная плашка преимущества */
export const Strip = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 16px;
  align-items: center;
  overflow: auto;
  padding: 8px;
`;

/** Пара изображений */
export const Pair = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
  @media (min-width: 720px) {
    grid-template-columns: 1fr 1fr;
  }
  .pair-item {
    border-radius: 10px;
    overflow: hidden;
    background: #f6f7f8;
    img,
    video {
      display: block;
      width: 100%;
      height: auto;
    }
  }
`;
