import styled from '@emotion/styled';
import { motion } from 'framer-motion';

import { media } from '@/styles/breakpoints';
import { tokens } from '@/styles/shared';

export const FaqSectionWrapper = styled.section`
  background: #fff;
  padding: ${tokens.spacing.xl} ${tokens.spacing.sm} ${tokens.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.lg};

  ${media.down('tablet')} {
    padding: ${tokens.spacing.lg} ${tokens.spacing.sm};
  }
`;

export const FaqHeading = styled.h2`
  ${tokens.typography.h2};
  text-align: center;
  color: ${tokens.colors.semantic.text.primary};
  font-weight: 600;
`;

export const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.sm};
`;

export const FaqItem = styled.div`
  border: 1px solid #e5e5e5;
  /* border-radius: 12px; */
  padding: ${tokens.spacing.md};
  background: ${tokens.colors.semantic.background.secondary};
  cursor: pointer;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  }
`;

export const FaqQuestion = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #111;
  font-size: 1.05rem;
`;

export const FaqAnswer = styled(motion.div)`
  ${tokens.typography.body};
  color: #444;
  margin-top: ${tokens.spacing.sm};
  line-height: 1.6;
`;
