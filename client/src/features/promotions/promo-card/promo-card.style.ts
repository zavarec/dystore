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

  @media (max-width: 992px) {
    aspect-ratio: 16 / 9;
  }

  @media (max-width: 768px) {
    aspect-ratio: 4 / 5;
    border-radius: 8px;
    margin: 12px 0;
  }
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

  @media (max-width: 768px) {
    padding: 16px;
    max-width: 100%;
    h2 {
      font-size: 24px;
    }
    p {
      font-size: 14px;
      margin-bottom: 12px;
    }
  }
`;

export const ButtonsRow = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    width: 100%;

    a,
    button {
      width: 100%;
      text-align: center;
    }
  }
`;
