import styled from '@emotion/styled';

import { media } from '@/styles/breakpoints';

export const ContactSupportSection = styled.section`
  padding: 72px 0;
  background: linear-gradient(180deg, #f5f7fb 0%, #f0f2f8 100%);

  ${media.down('tablet')} {
    padding: 48px 0;
  }
`;

export const ContactSupportContainer = styled.div`
  padding: 0 var(--page-gutter);
`;

export const ContactSupportCard = styled.div`
  background: #111827;
  color: #f8fafc;
  border-radius: 28px;
  padding: 56px;
  box-shadow:
    0 32px 80px rgba(17, 24, 39, 0.25),
    0 12px 28px rgba(17, 24, 39, 0.15);
  display: grid;
  gap: 20px;

  ${media.down('laptop')} {
    padding: 48px;
    border-radius: 24px;
  }

  ${media.down('tablet')} {
    padding: 36px;
    border-radius: 20px;
    gap: 16px;
  }

  ${media.down('mobile')} {
    padding: 28px 24px;
    border-radius: 18px;
  }
`;

export const ContactSupportTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
`;

export const ContactSupportLead = styled.p`
  margin: 0;
  font-size: clamp(1rem, 2.2vw, 1.2rem);
  line-height: 1.6;
  color: rgba(248, 250, 252, 0.9);
`;

export const ContactSupportBody = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(248, 250, 252, 0.85);
`;

export const ContactSupportSchedule = styled.div`
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(248, 250, 252, 0.75);

  strong {
    display: inline-block;
    font-weight: 600;
    color: #f8fafc;
  }
`;
