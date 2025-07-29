import React from 'react';

import { PageContainer, Main } from './layout.style';
import { Header } from '../atoms/header';
import { Footer } from '../atoms/footer';
import { GlobalAuthModal } from '../atoms/global-auth-modal';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <>
      <Header />
      <PageContainer className={className}>
        <Main>{children}</Main>
        <Footer />
      </PageContainer>
      <GlobalAuthModal />
    </>
  );
};
