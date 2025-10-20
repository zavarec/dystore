import Image from 'next/image';

import styled from '@emotion/styled';

import { media } from '../breakpoints';
import { commonStyles, tokens } from '../shared';

export const ContactsPageContainer = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xl};
  padding-bottom: ${tokens.spacing.xl};
`;

/* ---------- HERO ---------- */
export const ContactsHero = styled.section`
  ${commonStyles.container}
  position: relative;
  width: 100%;
  height: 70vh;
  min-height: 500px;
  color: #fff;
  display: flex;
  align-items: center;
  text-align: left;
  overflow: hidden;
  background-color: #000;
  ${media.down('tablet')} {
    height: 60vh;
    min-height: 380px;
    text-align: center;
  }
`;

export const ContactsHeroImage = styled(Image)`
  padding: ${tokens.spacing.md};
  padding-right: 70px;
  object-fit: contain;
  object-position: center;
  z-index: 0;
`;

export const ContactsHeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
`;

export const ContactsHeroContent = styled.div`
  position: relative;
  z-index: 2;

  max-width: 1240px;
  width: 100%;

  ${media.down('tablet')} {
    padding: 0 ${tokens.spacing.md};
  }
`;

export const ContactsHeroTitle = styled.h1`
  ${tokens.typography.h1};
  font-weight: 300;
  color: #fff;
  margin-bottom: ${tokens.spacing.xs};
`;

export const ContactsHeroSubtitle = styled.p`
  ${tokens.typography.body};
  color: #919191;
  /* font-size: clamp(1rem, 1.3vw, 1.25rem); */
  max-width: 600px;

  ${media.down('tablet')} {
    /* margin: 0 auto; */
  }
`;

/* ---------- GRID ---------- */
export const ContactsSection = styled.section`
  /* max-width: 1240px; */
  margin: 0 auto;
  ${commonStyles.container}
`;

export const ContactsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  gap: clamp(${tokens.spacing.sm}, 2vw, ${tokens.spacing.md});

  ${media.down('desktop')} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.down('tablet')} {
    grid-template-columns: 1fr;
  }
`;

export const ContactsCard = styled.article`
  background: #fff;
  border: 1px solid ${tokens.colors.semantic.border.default};
  padding: ${tokens.spacing.md};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
  gap: ${tokens.spacing.sm};
`;

export const ContactsCardIcon = styled.div`
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 10px;
`;

export const ContactsCardTitle = styled.h3`
  font-size: 1.25rem;
  line-height: 1.3;
  font-weight: 600;
  color: #111;
`;

export const ContactsCardText = styled.p`
  ${tokens.typography.bodySm};
  p {
    margin: 0;
  }
`;

export const ContactsCardList = styled.ul`
  display: grid;
  gap: ${tokens.spacing.xs};
  color: #333;

  a {
    text-decoration: underline;
    color: inherit;
  }
`;

export const ContactsCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.sm};
  flex-grow: 1;
`;
export const ContactsCTA = styled.a`
  margin-top: 4px;
  white-space: nowrap;
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid #111;
  background: #111;
  color: ${tokens.colors.palette.white};
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.2;
  width: fit-content; /* 🟢 кнопка теперь одинаковая по ширине */
  height: 40px; /* 🟢 одинаковая высота */
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.1s ease;

  &:hover {
    background: #222;
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(1px);
  }
`;
