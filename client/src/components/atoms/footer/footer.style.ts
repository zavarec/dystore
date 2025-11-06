import Link from 'next/link';

import styled from '@emotion/styled';

import { media } from '@/styles/breakpoints';

export const FooterContainer = styled.footer`
  background: #000000;
  color: white;
  padding: 24px var(--page-gutter);
`;

export const FooterContent = styled.div`
  margin-left: auto;
`;

export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(260px, 1fr) 2fr;
  gap: 40px;
  margin-bottom: 30px;

  ${media.down('tablet')} {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

export const FooterSection = styled.div`
  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 20px;
    color: #fff;
  }
`;

export const FooterLink = styled(Link)`
  color: #ccc;
  text-decoration: none;
  display: block;
  margin-bottom: 6px;
  transition: color 0.3s ease;

  font-size: 16px;
  &:hover {
    color: #fff;
  }
`;

export const FooterText = styled.p`
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 10px;
`;

export const FooterEmailButton = styled.button`
  color: inherit;
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;

  &:hover,
  &:focus {
    color: #fff;
  }
`;

export const FooterBottom = styled.div`
  border-top: 1px solid #333;
  padding-top: 20px;
  text-align: center;
  color: #999;
  font-size: 0.9rem;
`;

export const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const LogoIcon = styled.div`
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #ffff, rgb(52, 52, 53));
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
`;

export const FooterContentWrapper = styled.div`
  margin-left: auto;
  display: flex;
  gap: 32px;
  justify-content: flex-end;
  align-items: flex-start;
  text-align: right;

  // делаем колонки немного уже, чтобы аккуратнее смотрелось
  & > ${FooterSection} {
    min-width: 200px;
  }

  ${media.down('tablet')} {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    gap: 24px;

    & > ${FooterSection} {
      min-width: 0;
    }
  }
`;
