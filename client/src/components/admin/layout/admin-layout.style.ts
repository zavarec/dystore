import styled from '@emotion/styled';

export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
`;

export const Sidebar = styled.aside`
  width: 250px;
  background: #1a1a1a;
  color: white;
  padding: 20px 0;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
`;

export const Logo = styled.div`
font-size: 24px;
  font-weight: 700;
  padding: 0 20px 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
`;

export const NavSection = styled.div`
  margin-bottom: 30px;
`;

export const NavTitle = styled.h3`
  font-size: 12px;
  text-transform: uppercase;
  color: #999;
  margin: 0 20px 10px;
  font-weight: 600;
`;

export const NavLink = styled.a<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: ${props => (props.$isActive ? '#fff' : '#ccc')};
  background: ${props => (props.$isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent')};
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid ${props => (props.$isActive ? '#007bff' : 'transparent')};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }

  svg {
    font-size: 20px;
  }
`;

export const MainContent = styled.main`
  flex: 1;
  margin-left: 250px;
  padding: 20px;
`;

export const Header = styled.header`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const UserName = styled.span`
  color: #666;
  font-size: 14px;
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
    border-color: #999;
  }
`;
