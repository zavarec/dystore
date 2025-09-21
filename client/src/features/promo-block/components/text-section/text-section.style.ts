import styled from '@emotion/styled';

import { fontFamilyMap } from '@/constants/fonts.constants';
import type { PromoFont } from '@/types/models/promo-section.model';

export const TextWrap = styled.section<{ $bg?: string | null }>`
  position: relative;
  width: 100%;
  background-color: ${({ $bg }) => $bg ?? '#000000'};
  /* background: '#000000'; */
  background-color: ${({ $bg }) => $bg ?? '#000000'};
`;

export const TextInner = styled.div<{
  $align: 'left' | 'center' | 'right';
  $pt?: number | null;
  $pb?: number | null;
  $fs?: number | null;
}>`
  /* max-width: 1100px; */
  /* margin: 0 auto; */
  padding: ${({ $pt }) => ($pt != null ? `${$pt}px` : 'clamp(24px, 6vw, 96px)')}
    clamp(16px, 5vw, 64px) ${({ $pb }) => ($pb != null ? `${$pb}px` : 'clamp(24px, 6vw, 96px)')};
  display: grid;
  row-gap: clamp(12px, 3vw, 28px);
  justify-items: ${({ $align }) =>
    $align === 'left' ? 'start' : $align === 'right' ? 'end' : 'center'};
  text-align: ${({ $align }) => $align};
  font-size: ${({ $fs }) => ($fs != null ? `${$fs}px` : 'inherit')};
`;

export const Badge = styled.img`
  width: clamp(56px, 10vw, 160px);
  height: auto;
  display: block;
`;

export const Quote = styled.blockquote<{
  $font?: PromoFont | null;
  $color?: string | null;
  $fs?: number | null;
  $tf?: number | null;
}>`
  margin: 0;
  max-width: 980px;
  font-family: ${({ $font }) => fontFamilyMap[$font || 'DEFAULT']};
  color: ${({ $color }) => $color ?? '#111'};
  font-weight: 400;
  font-size: ${({ $fs }) => ($fs != null && $fs !== 0 ? `${$fs}px` : '32px')};
  line-height: 1.35;
`;

export const Divider = styled.hr<{ $color?: string | null }>`
  width: 120px;
  height: 1px;
  border: 0;
  margin: clamp(8px, 2vw, 16px) 0;
  background: ${({ $color }) => $color ?? 'rgba(0,0,0,0.15)'};
`;

export const Award = styled.div<{ $color?: string | null }>`
  font-size: clamp(16px, 1.8vw, 22px);
  font-weight: 600;
  color: ${({ $color }) => $color ?? '#111'};
`;

export const Source = styled.div<{ $color?: string | null }>`
  font-size: clamp(12px, 1.4vw, 16px);
  opacity: 0.85;
  color: ${({ $color }) => $color ?? '#111'};
`;
