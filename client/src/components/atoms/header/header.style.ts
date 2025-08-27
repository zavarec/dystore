import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import Link from 'next/link';

const HeaderContainer = styled.header<{ $isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => (props.$isScrolled ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 1)')};
  backdrop-filter: blur(10px);
  border-bottom: ${props =>
    props.$isScrolled ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid transparent'};
  transition: all 0.3s ease;
  box-shadow: ${props => (props.$isScrolled ? '0 2px 20px rgba(0, 0, 0, 0.1)' : 'none')};
`;

export const MotionHeaderContainer = motion(HeaderContainer);

export const HeaderContent = styled.div`
  padding: 0 20px;
  display: flex;
  align-items: center;
  height: 70px;
  margin-top: 8px;
  gap: 24px;

  @media (max-width: 1100px) {
    padding: 0 16px;
    height: 60px;
    justify-content: space-between;
  }
`;

export const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: #007bff;
  }

  @media (max-width: 1100px) {
    font-size: 1.5rem;
  }
`;

export const Navigation = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 32px;
  position: static;

  flex: 1;
  justify-content: flex-start;

  /* небольшой отступ от логотипа */
  margin-left: 8px;

  @media (max-width: 1100px) {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.98);
    backdrop-filter: blur(10px);
    flex-direction: column;
    padding: 20px;
    gap: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    transform: translateY(${props => (props.$isOpen ? '0' : '-100%')});
    opacity: ${props => (props.$isOpen ? '1' : '0')};
    visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
    transition: all 0.3s ease;
    z-index: 999;
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1; /* тянем левую часть */
  min-width: 0;
`;

export const StyledNavLink = styled.a<{ $isActive: boolean }>`
  color: ${props => (props.$isActive ? '#007bff' : '#ffffff')};
  text-decoration: none;
  font-weight: ${props => (props.$isActive ? '600' : '400')};
  font-size: 14px;
  position: relative;
  padding: 8px 0;
  transition: color 0.3s ease;

  &:hover {
    color: rgb(143, 145, 148);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${props => (props.$isActive ? '100%' : '0')};
    height: 2px;
    background: rgb(223, 224, 224);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #ffffff;
  position: absolute;
  right: 20px;

  @media (max-width: 1100px) {
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: static;
  }
`;

export const MenuLine = styled.div<{ $isOpen: boolean; $index: number }>`
  width: 24px;
  height: 2px;
  background: #ffffff;
  transition: all 0.3s ease;
  transform-origin: center;

  ${props =>
    props.$isOpen &&
    props.$index === 0 &&
    `
    transform: rotate(45deg) translate(5px, 5px);
  `}

  ${props =>
    props.$isOpen &&
    props.$index === 1 &&
    `
    opacity: 0;
  `}

  ${props =>
    props.$isOpen &&
    props.$index === 2 &&
    `
    transform: rotate(-45deg) translate(7px, -6px);
  `}
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 1100px) {
    width: 100%;
    order: -1;
  }
`;

export const SearchInput = styled.input`
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: #f8f9fa;
  font-size: 14px;
  width: 200px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    background: white;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  @media (max-width: 1100px) {
    width: 100%;
  }
`;

export const AuthButton = styled.button`
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-1px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 1100px) {
    padding: 6px 12px;
    font-size: 13px;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 1100px) {
    flex-direction: column;
    gap: 8px;
  }
`;

export const UserName = styled.span`
  color: white;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;

  @media (max-width: 1100px) {
    font-size: 13px;
  }
`;

export const LogoutButton = styled.button`
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border-color: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 1100px) {
    padding: 4px 8px;
    font-size: 11px;
  }
`;
