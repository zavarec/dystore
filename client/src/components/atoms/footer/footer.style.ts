import styled from '@emotion/styled';
import Link from 'next/link';

import { media } from '@/styles/breakpoints';

export const FooterContainer = styled.footer`
  background: #1a1a1a;
  color: white;
  padding: 40px 0 20px;
  margin-top: 80px;
`;

export const FooterContent = styled.div`
  max-width: 1200px;

  padding: 0 var(--page-gutter);
`;

export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
  margin-bottom: 10px;
  transition: color 0.3s ease;

  &:hover {
    color: #fff;
  }
`;

export const FooterText = styled.p`
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 10px;
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
  ${media.down('tablet')} {
    display: flex;
    justify-content: space-between;
  }
`;
