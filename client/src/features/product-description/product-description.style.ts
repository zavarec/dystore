import styled from '@emotion/styled';

import { media } from '@/styles/breakpoints';
import { tokens } from '@/styles/shared';

export const SectionWrap = styled.section`
  border-radius: 28px;
  background: ${tokens.colors.bgSecondary};
  color: #111827;
  font-family: var(--font-nunito-sans, 'Nunito Sans', sans-serif);

  ${media.down('mobile')} {
  }
`;

export const Container = styled.div`
  width: 100%;
  display: grid;
`;

export const ToggleBar = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ToggleButton = styled.button<{ isOpen: boolean }>`
  width: 100%;
  background: rgba(255, 255, 255, 0.48);
  border: 1px solid rgba(17, 24, 39, 0.12);
  border-bottom: ${({ isOpen }) => (isOpen ? '0px' : `1px solid rgba(17, 24, 39, 0.12)`)};

  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${tokens.typography.h2};
  cursor: pointer;
  color: #222222;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(17, 24, 39, 0.32);
    border-bottom-color: ${({ isOpen }) => (isOpen ? 'transparent' : `rgba(17, 24, 39, 0.32)`)};
    box-shadow: 0 18px 36px rgba(17, 24, 39, 0.12);
  }

  &:focus {
    outline: none;
  }

  ${media.down('mobile')} {
  }
  padding: 40px var(--page-gutter);
  padding-top: 23px;
  padding-bottom: 23px;
`;

export const ChevronIcon = styled.svg<{ $open: boolean }>`
  width: 48px;
  height: 38px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
  transform: rotate(${props => (props.$open ? '180deg' : '0deg')});
`;

export const Collapse = styled.div<{ $open: boolean }>`
  overflow: hidden;
  max-height: ${props => (props.$open ? '1000px' : '0')};
  transition: max-height 0.3s ease;
`;

export const CollapseInner = styled.div<{ isOpen: boolean }>`
  padding: clamp(20px, 4vw, 32px);
  background: ${tokens.colors.bgSecondary};

  border: 1px solid rgba(17, 24, 39, 0.08);
  border-top: ${({ isOpen }) => (isOpen ? '0px' : `1px solid rgba(17, 24, 39, 0.12)`)};

  box-shadow: 0 30px 60px rgba(17, 24, 39, 0.08);
  display: grid;
  gap: 18px;

  ${media.down('mobile')} {
    padding: 18px 16px;
  }
  padding: 40px var(--page-gutter);
`;

export const Title = styled.h3`
  margin: 0;
  font-size: clamp(20px, 3vw, 26px);
  font-weight: 700;
  color: #0f172a;
`;

export const Body = styled.div`
  display: grid;
  gap: 14px;
  font-size: clamp(16px, 2.4vw, 18px);
  line-height: 1.65;
  color: rgba(15, 23, 42, 0.88);
`;

export const Paragraph = styled.p`
  margin: 0;
  white-space: pre-line;
`;
