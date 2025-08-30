import styled from '@emotion/styled';

export interface PromoStyleProps {
  titleColor?: string | undefined;
  textColor?: string | undefined;
  fontFamily?: string | undefined;
}

export const Section = styled.section<PromoStyleProps>`
  position: relative;
  overflow: hidden;

  aspect-ratio: 16 / 6;

  video,
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  display: flex;
  align-items: center;
  font-family: ${p => p.fontFamily || 'inherit'};
`;

export const Content = styled.div<PromoStyleProps>`
  position: relative;
  z-index: 1;
  padding: 48px var(--page-gutter);
  background: transparent;

  max-width: 720px;

  h2 {
    margin: 8px 0 12px;
    font-size: 36px;
    line-height: 1.1;
    color: ${p => p.titleColor || 'inherit'};
  }

  p {
    font-size: 18px;
    margin-bottom: 20px;
    color: ${p => p.textColor || 'inherit'};
  }
`;
