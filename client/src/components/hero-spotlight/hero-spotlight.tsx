import React from 'react';
import styled from '@emotion/styled';

type Align = 'left' | 'right';

interface MotifImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface HeroSpotlightProps {
  /** Фон десктоп */
  bgImage: string;
  /** Фон мобилки (необязательно) */
  bgImageMobile?: string;
  /** Позиция кадра десктоп (CSS background-position) */
  focalDesktop?: string; // напр. "center", "60% 40%", "right center"
  /** Позиция кадра мобилка */
  focalMobile?: string; // напр. "top", "center 20%"
  /** Интенсивность затемнения (0..1) */
  overlay?: number;
  /** Отступ контентной колонки от края */
  gutterPx?: number;
  /** Выравнивание контента */
  align?: Align;

  motifImage?: MotifImage;

  title: string;
  subtitle?: string;

  buttonPrimary?: { label: string; href: string };
  buttonSecondary?: { label: string; href: string };
}

const BREAK_MD = 768;

const Section = styled.section<{
  bgImage: string;
  bgImageMobile?: string;
  focalDesktop?: string;
  focalMobile?: string;
}>`
  position: relative;
  width: 100%;
  min-height: 520px;
  display: flex;
  align-items: center;
  color: #fff;

  background-image: url(${p => p.bgImage});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: ${p => p.focalDesktop || 'center'};

  @media (max-width: ${BREAK_MD}px) {
    min-height: 380px;
    background-image: url(${p => p.bgImageMobile || p.bgImage});
    background-position: ${p => p.focalMobile || p.focalDesktop || '60%'};
  }
`;

const Overlay = styled.div<{ opacity: number }>`
  position: absolute;
  inset: 0;
  /* слева → вправо, помогает читабельности текста */
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, ${p => p.opacity}) 0%,
    rgba(0, 0, 0, ${p => Math.max(p.opacity - 0.2, 0)}) 45%,
    rgba(0, 0, 0, 0) 100%
  );

  @media (max-width: ${BREAK_MD}px) {
    /* на мобиле обычно нужно больше затемнить центр */
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, ${p => p.opacity}) 0%,
      rgba(0, 0, 0, ${p => p.opacity * 0.7}) 40%,
      rgba(0, 0, 0, 0) 100%
    );
  }
`;

const Container = styled.div<{ align: Align; gutterPx: number }>`
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 64px 20px;

  display: flex;
  justify-content: ${p => (p.align === 'right' ? 'flex-end' : 'flex-start')};

  .content {
    max-width: 720px;
    text-align: ${p => (p.align === 'right' ? 'right' : 'left')};
    margin-left: ${p => (p.align === 'left' ? `${p.gutterPx}px` : 0)};
    margin-right: ${p => (p.align === 'right' ? `${p.gutterPx}px` : 0)};
  }

  @media (max-width: ${BREAK_MD}px) {
    padding: 32px 16px;
    .content {
      margin: 0; /* на мобиле без больших боковых отступов */
      max-width: 100%;
    }
  }
`;

const Motif = styled.div<{ align: Align }>`
  margin-bottom: 12px;
  display: flex;
  justify-content: ${p => (p.align === 'right' ? 'flex-end' : 'flex-start')};
  img {
    display: block;
    height: auto;
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.25));
  }
  z-index: 4;

  @media (max-width: ${BREAK_MD}px) {
    img {
      max-width: 60%;
    } /* логотип слегка меньше на мобиле */
  }
`;

const Title = styled.h2`
  margin: 0 0 16px;
  font-size: clamp(26px, 5.2vw, 44px);
  font-weight: 600;
  line-height: 1.15;
  z-index: 4;
`;

const Subtitle = styled.p`
  margin: 0 0 24px;
  max-width: 640px;
  font-size: clamp(15px, 3.4vw, 20px);
  color: rgba(255, 255, 255, 0.88);
  z-index: 5;

  @media (max-width: ${BREAK_MD}px) {
    max-width: 90%;
  }
`;

const Buttons = styled.div<{ align: Align }>`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: ${p => (p.align === 'right' ? 'flex-end' : 'flex-start')};
`;

const Btn = styled.a<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition:
    background 0.2s ease,
    color 0.2s ease;

  ${({ variant }) =>
    variant === 'secondary'
      ? `background:#fff;color:#111;&:hover{background:#f3f3f3;}`
      : `background:#b3e635;color:#121212;&:hover{background:#c7f04b;}`};
`;

export const HeroSpotlight: React.FC<HeroSpotlightProps> = ({
  bgImage,

  focalDesktop = 'center',
  focalMobile = 'center',
  overlay = 0.7,
  gutterPx = 56,
  align = 'left',
  motifImage,
  title,
  subtitle,
  buttonPrimary,
  buttonSecondary,
}) => (
  <Section
    bgImage={bgImage}
    // bgImageMobile={bgImageMobile}
    focalDesktop={focalDesktop}
    focalMobile={focalMobile}
    aria-label={title}
  >
    <Overlay opacity={overlay} />
    <Container align={align} gutterPx={gutterPx}>
      <div className="content">
        {motifImage?.src && (
          <Motif align={align}>
            <img
              src={motifImage.src}
              alt={motifImage.alt ?? ''}
              width={motifImage.width ?? 220}
              height={motifImage.height}
            />
          </Motif>
        )}
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        {(buttonPrimary || buttonSecondary) && (
          <Buttons align={align}>
            {buttonPrimary && (
              <Btn href={buttonPrimary.href} variant="primary">
                {buttonPrimary.label}
              </Btn>
            )}
            {buttonSecondary && (
              <Btn href={buttonSecondary.href} variant="secondary">
                {buttonSecondary.label}
              </Btn>
            )}
          </Buttons>
        )}
      </div>
    </Container>
  </Section>
);
