import styled from '@emotion/styled';

import { media } from '../breakpoints';
import { tokens, commonStyles } from '../shared';

const { colors } = tokens;

export const ProductPageContainer = styled.div`
  ${commonStyles.container};
  padding-top: 40px;
  padding-right: 0;
  ${media.down('tablet')} {
    padding-left: 0;
  }

  color: ${colors.semantic.text.primary};
`;

export const ProductBreadcrumbs = styled.nav`
  margin-bottom: 32px;
  font-size: 14px;
  color: #666;

  a {
    color: black;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${colors.semantic.text.primary};
      text-decoration: underline;
    }
  }

  ${media.down('tablet')} {
    border-bottom: 1px solid #ebebeb;
    padding-left: 20px;
  }
`;

export const BreadcrumbLink = styled.a`
  color: ${colors.semantic.text.primary};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #0056b3;
    text-decoration: underline;
  }
`;

export const ProductImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ProductMainImage = styled.div`
  width: 100%;
  height: 600px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  object-fit: contain;
`;

export const ProductThumbnails = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ThumbnailImage = styled.div`
  width: 80px;
  height: 80px;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: ${colors.semantic.border.inverse};
  }
`;

export const ProductInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: ${colors.semantic.text.primary};
`;

export const ProductTitle = styled.h1`
  font-size: 32px;
  font-weight: 400;
  line-height: 1.2;
  margin: 0;
  color: ${colors.semantic.text.primary};
`;

export const ProductDescription = styled.p`
  font-size: 16px;
  color: ${colors.semantic.text.primary};
  line-height: 1.6;
  margin: 0;
`;

export const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const CurrentPrice = styled.span`
  font-size: 32px;
  font-weight: 700;
  color: ${colors.semantic.text.primary};
`;

export const ProductActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ProductInfoWithImageWrapperStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;

  ${media.down('tablet')} {
    display: flex;
    flex-direction: column;
    padding: 40px var(--page-gutter);
  }
  color: ${colors.semantic.text.primary};
`;

export const ProductMotifMobileWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  justify-content: flex-start;

  img {
    max-width: 90%;
    height: auto;
  }

  ${media.up('tablet')} {
    display: none;
  }
`;

export const ProductMotifDesktopWrapper = styled.div`
  display: none;

  ${media.up('tablet')} {
    display: flex;
    margin-bottom: 12px;
  }
`;

export const ContactRequestFormWrapper = styled.div`
  > div > form {
    margin: 42px;
  }
`;
