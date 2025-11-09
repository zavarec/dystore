import Link from 'next/link';

import styled from '@emotion/styled';

import { media } from '@/styles/breakpoints';
import { commonStyles, tokens } from '@/styles/shared';

import { BreadcrumbArrow } from '../breadcrumb-arrow/breadcrumb-arrow';

const { colors } = tokens;

export const BreadCrumbContainer = styled.nav`
  ${commonStyles.container};
  padding-top: 16px;
  padding-bottom: 16px;
  font-size: 16px;
  font-weight: 400;
  color: #333;

  ${media.down('tablet')} {
    border-bottom: 1px solid ${tokens.colors.semantic.divider.default};
    padding: 0 20px;
    font-size: 14px;
  }
`;

export const BreadCrumbList = styled.ol`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const BreadCrumbItem = styled.li`
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
`;

export const BreadCrumbLinkStyled = styled(Link)`
  color: ${colors.semantic.text.primary};
  text-decoration: underline;
  transition: color 0.2s ease;
  padding-right: 10px;

  &:hover {
    color: ${colors.semantic.text.primary};
  }

  ${media.down('tablet')} {
    padding: 12px 0;
  }
`;

export const BreadCrumbCurrent = styled.span`
  color: #000;
  ${media.down('tablet')} {
    display: none;
  }
`;

export const BreadCrumbSeparator = styled(BreadcrumbArrow)`
  flex-shrink: 0;
`;

/* ——— Мобильная логика ——— */
export const BreadCrumbHomeItem = styled(BreadCrumbItem)`
  ${media.down('tablet')} {
    display: none;
  }
`;

export const BreadCrumbCategoryItem = styled(BreadCrumbItem)`
  display: inline-flex;
  align-items: center;

  ${media.down('tablet')} {
    display: none;
  }

  svg.back {
    display: none;

    ${media.down('tablet')} {
      display: inline-block;

      transform: scaleX(-1);
    }
  }
`;

export const BreadCrumbMobileBackLink = styled(Link)`
  display: none;

  ${media.down('tablet')} {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 0;
    text-decoration: underline;
    color: ${colors.semantic.text.primary};
    font-size: 14px;
  }

  svg {
    transform: scaleX(-1); /* стрелка влево */
    flex-shrink: 0;
  }
`;
