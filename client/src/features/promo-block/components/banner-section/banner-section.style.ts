import styled from '@emotion/styled';

import type { PromoFont } from '@/types/models/promo-section.model';

export const BannerWrap = styled.section<{ $bg?: string | null; $height?: number | null }>`
  position: relative;
  width: 100%;
  min-height: ${({ $height }) => ($height ? `${$height}px` : '500px')};
  background: ${({ $bg }) => $bg || '#000'};
  overflow: hidden;
`;

/* Медиа — на фоне, растянуто на всю секцию */
export const Media = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover; /* ключ: фулл-блид */
    display: block;
  }
`;

/* Контейнер поверх медиа, управляет стороной контента */
export const ContentRow = styled.div<{
  $side: 'LEFT' | 'RIGHT' | 'CENTER';
  $pt?: number | null;
  $pb?: number | null;
}>`
  position: relative;
  z-index: 2; /* 👈 контент точно поверх медиа и оверлея */

  display: flex;
  align-items: center; /* по центру вертикально */
  justify-content: ${({ $side }) =>
    $side === 'RIGHT' ? 'flex-end' : $side === 'CENTER' ? 'center' : 'flex-start'};
  width: 100%;
  min-height: inherit;

  padding-top: ${({ $pt }) => ($pt != null ? `${$pt}px` : 'clamp(24px, 6vw, 96px)')};
  padding-bottom: ${({ $pb }) => ($pb != null ? `${$pb}px` : 'clamp(24px, 6vw, 96px)')};

  /* глобальные поля 70px: --page-gutter = clamp(16px, 5vw, 70px) */
  /* padding-inline: var(--page-gutter, 70px); */

  @media (max-width: 768px) {
    justify-content: center;
    text-align: center;
  }
`;

export const BannerContent = styled.div<{
  $side: 'LEFT' | 'RIGHT' | 'CENTER';
  $text?: string | null;
  $title?: string | null;
  $font?: PromoFont | null;
  titleSize?: number | null;
  contentSize: number | null;
}>`
  max-width: 640px; /* ширина текстового блока */
  /* color: ${({ $text }) => $text || '#fff'}; */
  color: #fff;
  font-family: ${({ $font }) =>
    $font === 'INTER'
      ? 'Inter, system-ui, sans-serif'
      : $font === 'ROBOTO'
        ? 'Roboto, system-ui, sans-serif'
        : $font === 'MONTSERRAT'
          ? 'Montserrat, system-ui, sans-serif'
          : $font === 'POPPINS'
            ? 'Poppins, system-ui, sans-serif'
            : $font === 'NUNITO_SANS'
              ? 'var(--font-nunito-sans), system-ui, sans-serif'
              : 'var(--font-nunito-sans), system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'};

  /* дополнительный внутренний отступ «70px» у ближней к краю стороны */
  padding-left: ${({ $side }) => ($side === 'LEFT' ? 'var(--page-gutter, 70px)' : 0)};
  padding-right: ${({ $side }) => ($side === 'RIGHT' ? 'var(--page-gutter, 70px)' : 0)};
  text-align: ${({ $side }) => ($side === 'CENTER' ? 'center' : 'left')};

  h3 {
    margin: 0 0 16px 0;
    font-size: ${({ titleSize }) => (titleSize != null ? `${titleSize}px` : '2.5rem')};
    line-height: 1.2;
    color: ${({ $title }) => $title || '#fff'};
  }

  p {
    margin: 0 0 16px 0;
    font-size: ${({ contentSize }) => (contentSize != null ? `${contentSize}px` : '2.5rem')};
    line-height: 1.5;
    opacity: 0.9;
    color: ${({ $text }) => $text || '#fff'};
  }

  @media (max-width: 768px) {
    padding-left: 0;
    padding-right: 0;
    max-width: min(560px, calc(100% - 32px));
  }
`;
