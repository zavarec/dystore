import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { House, FolderOpen, SignOut, Plus, List, Megaphone } from '@phosphor-icons/react';
import {
  Header,
  LayoutContainer,
  Logo,
  LogoutButton,
  MainContent,
  NavLink,
  NavSection,
  NavTitle,
  PageTitle,
  Sidebar,
  UserName,
  UserSection,
} from './admin-layout.style';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const router = useRouter();
  const currentPath = router.pathname;

  const handleLogout = () => {
    // Implement logout logic
    localStorage.removeItem('access_token');
    router.push('/');
  };

  const navItems = [
    {
      section: 'Главное',
      items: [{ href: '/admin', label: 'Дашборд', icon: House }],
    },
    {
      section: 'Каталог',
      items: [
        { href: '/admin/products', label: 'Все продукты', icon: List },
        { href: '/admin/products/new', label: 'Добавить продукт', icon: Plus },
        { href: '/admin/categories', label: 'Категории', icon: FolderOpen },
        { href: '/admin/categories/new-category-page', label: 'Добавить категорию', icon: Plus },
        { href: '/admin/users', label: 'Пользователи', icon: List },
        { href: '/admin/promotions', label: 'Промо', icon: Megaphone },
      ],
    },
  ];

  return (    
    <LayoutContainer>
      <Sidebar>
        <Logo>DyStore Admin</Logo>

        {navItems.map(section => (
          <NavSection key={section.section}>
            <NavTitle>{section.section}</NavTitle>
            {section.items.map(item => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} passHref legacyBehavior>
                  <NavLink $isActive={currentPath === item.href}>
                    <Icon />
                    {item.label}
                  </NavLink>
                </Link>
              );
            })}
          </NavSection>
        ))}
      </Sidebar>

      <MainContent>
        <Header>
          <PageTitle>{title}</PageTitle>
          <UserSection>
            <UserName>Администратор</UserName>
            <LogoutButton onClick={handleLogout}>
              <SignOut size={18} />
              Выйти
            </LogoutButton>
          </UserSection>
        </Header>

        {children}
      </MainContent>
    </LayoutContainer>
  );
};
