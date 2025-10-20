import styled from '@emotion/styled';

import { commonStyles, tokens } from '@/styles/shared';

const { colors } = tokens;

export const AboutCompanyPageWrapper = styled.main`
  background: #fff;
  color: ${colors.semantic.text.primary};
`;

export const AboutCompanyContainer = styled.div`
  ${commonStyles.container}
`;

export const AboutCompanyHeadingRow = styled.header`
  /* padding: 0 var(--page-gutter); */
  position: sticky;
  top: 0;
  z-index: 1;
  background: ${colors.components.dropdown.bg};
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
`;

export const AboutCompanyHeadingInner = styled.div`
  max-width: 100%;

  height: 64px;
  display: flex;
  align-items: center;
`;

export const AboutCompanyTitle = styled.h1`
  font-weight: 300;
  letter-spacing: -0.01em;
  font-size: clamp(18px, 2.1vw, 22px);
  line-height: 3.25rem;
`;

export const AboutCompanySection = styled.section``;

export const AboutCompanyBlockTitle = styled.h2`
  font-size: clamp(24px, 4.4vw, 36px);
  line-height: 1.15;
  font-weight: 500;
  margin: 0 0 24px;
`;

export const AboutCompanyText = styled.p`
  font-size: clamp(16px, 2.1vw, 20px);
  line-height: 1.8;
  margin: 0 0 14px;
  letter-spacing: 0.005em;
  color: ${colors.semantic.text.secondary};
`;

export const AboutCompanyEmail = styled.a`
  color: #0b0b0b;
  text-decoration: underline;
  text-underline-offset: 2px;
  &:hover {
    opacity: 0.8;
  }
`;

export const AboutCompanyFooterBar = styled.footer`
  position: sticky;
  bottom: 0;
  background: #666666;
  color: #fff;
`;

export const AboutCompanyFooterInner = styled.div`
  max-width: 1160px;
  padding: 18px var(--page-gutter);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const AboutCompanyCrumbSep = styled.span`
  opacity: 0.65;
`;

export const AboutCompanyCrumbLink = styled.a`
  color: #fff;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  &:hover {
    border-bottom-color: rgba(255, 255, 255, 0.7);
  }
`;
export const AboutCompanyList = styled.ul`
  margin: 16px 0 24px;
  padding-left: 20px;
  li {
    font-size: clamp(16px, 2.1vw, 20px);
    line-height: 1.7;
    margin-bottom: 8px;
  }
`;
