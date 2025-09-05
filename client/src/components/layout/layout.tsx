import React from 'react';
import { useRouter } from 'next/router';

import { PageContainer, Main } from './layout.style';
import { Header } from '../atoms/header';
import { Footer } from '../atoms/footer';

import { NoSSR } from '../atoms/no-ssr/no-ssr';
import { AmoCrmWidget } from '../integrations/amo-crm-widget';
import { AuthModalContent } from '@/features/auth/modals';

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
        <AmoCrmWidget
          id={process.env.NEXT_PUBLIC_AMO_ID!}
          hash={process.env.NEXT_PUBLIC_AMO_HASH!}
          locale="ru"
          color="#111827"
        />
        {!isAdminRoute && <Footer />}
      </PageContainer>
      <NoSSR fallback={null}>
        <AuthModalContent />
      </NoSSR>
    </>
  );
};
