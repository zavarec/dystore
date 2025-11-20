import { useRouter } from 'next/router';

import { AuthModal } from '@/features/auth/modals/auth-modal';
import { ContactRequestModal } from '@/features/contact-us-modal/contact-request-modal';

import { PageContainer, Main } from './layout.style';
import { Footer } from '../atoms/footer';
import { Header } from '../atoms/header';
import { TopHeader } from '../atoms/top-header';
import { NoSSR } from '../atoms/no-ssr/no-ssr';
import { AmoCrmWidget } from '../integrations/amo-crm-widget';
import ChatPanel, { CHAT_CONTAINER_ID } from '../integrations/chat-panel';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
      }}
    >
      <NoSSR fallback={null}>
        <TopHeader />
        <Header />
      </NoSSR>
      <PageContainer className={className}>
        <Main>{children}</Main>

        <ChatPanel />

        <div>
          <AmoCrmWidget
            id={process.env.NEXT_PUBLIC_AMO_ID!}
            hash={process.env.NEXT_PUBLIC_AMO_HASH!}
            locale="ru"
            containerSelector={`#${CHAT_CONTAINER_ID}`}
            // color="#111827"
          />
        </div>

        {!isAdminRoute && <Footer />}
      </PageContainer>

      <NoSSR fallback={null}>
        <AuthModal />
        <ContactRequestModal />
      </NoSSR>
    </div>
  );
};
