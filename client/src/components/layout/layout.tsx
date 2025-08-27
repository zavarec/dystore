import React from 'react';
import { useRouter } from 'next/router';

import { PageContainer, Main } from './layout.style';
import { Header } from '../atoms/header';
import { Footer } from '../atoms/footer';
import { AuthModal } from '../../features/auth/modals/auth-modal';
import { NoSSR } from '../atoms/no-ssr/no-ssr';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');
  return (
    <>
      <NoSSR fallback={null}>
        <Header />
      </NoSSR>
      <PageContainer className={className}>
        <Main>{children}</Main>
        {!isAdminRoute && <Footer />}
      </PageContainer>
      <NoSSR fallback={null}>
        <AuthModal />
      </NoSSR>
    </>
  );
};
