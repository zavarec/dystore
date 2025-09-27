import { useRouter } from 'next/router';

import { AuthModal } from '@/features/auth/modals/auth-modal';

import { PageContainer, Main } from './layout.style';
import { Footer } from '../atoms/footer';
import { Header } from '../atoms/header';
import { NoSSR } from '../atoms/no-ssr/no-ssr';
import { AmoCrmWidget } from '../integrations/amo-crm-widget';

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
        <AuthModal />
      </NoSSR>
    </>
  );
};
