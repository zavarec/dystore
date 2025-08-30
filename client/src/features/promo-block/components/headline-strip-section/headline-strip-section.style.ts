import styled from '@emotion/styled';
import { PromoFont } from '@/types/models/category-promo-section.model';
import { fontFamilyMap } from '@/constants/fonts.constants';

export const StripWrap = styled.section<{
  $bg?: string | null;
  $padY?: number; // вертикальные отступы в px (по умолчанию 28)
}>`
  width: 100%;
  background: ${({ $bg }) => $bg ?? '#000'};
  /* фиксируем «полоску»: только вертикальные паддинги, без min-height */
  padding: ${({ $padY = 28 }) => `${$padY}px 0`};
`;

export const StripInner = styled.div`
  max-width: 1400px;
  /* margin: 0 auto; */
  padding: 0 clamp(16px, 5vw, 70px);
`;

export const StripTitle = styled.h3<{
  $color?: string | null;
  $font?: PromoFont | null;
  $align?: string | null;
}>`
  margin: 0;
  text-align: ${({ $align }) => $align ?? 'center'};
  font-family: ${({ $font }) => fontFamilyMap[$font || 'DEFAULT']};
  color: ${({ $color }) => $color ?? '#fff'};
  font-weight: 600;
  font-size: clamp(20px, 2.4vw, 28px);
  line-height: 1.2;
`;
