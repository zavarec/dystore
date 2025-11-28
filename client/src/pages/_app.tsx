import { useEffect, useState } from 'react';

import type { AppProps } from 'next/app';

import { Global, css } from '@emotion/react';
import { appWithTranslation } from 'next-i18next';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import { Preloader } from '@/components/atoms/preloader/preloader';
import { Layout } from '@/components/layout';
import { useAppDispatch } from '@/hooks/redux';
import { initCsrf } from '@/services/security.service';
import { wrapper } from '@/store';
import { initializeAuth } from '@/store/slices/auth-slice/auth.slice';
import { loadUserProfile } from '@/store/slices/auth-slice/auth.thunks';
import { fetchCart } from '@/store/slices/cart-slice/cart.thunks';
import { FirstVisitFadeStyles } from '@/styles/first-visit/first-visit-fade';
import { FirstVisitBoot } from '@/styles/first-visit/firts-visit-boot';
import { fontClassNames } from '@/styles/fonts';
import { GlobalGutters } from '@/styles/global-gutters';
import 'react-toastify/dist/ReactToastify.css';
// Глобальные стили - чистые как после уборки Dyson
const globalStyles = css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    /* font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
      'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; */
    line-height: 1.6;
    color: #333;
    background-color: #ffffff;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden; /* Предотвращаем горизонтальную прокрутку */
    font-family: 'Helvetica', 'Arial', sans-serif;
  }
  h2 {
    font-size: 32px;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  ul,
  ol {
    list-style: none;
  }

  /* Accessibility */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Focus styles */
  *:focus {
    /* outline: 2px solid #007bff; */
    outline-offset: 2px;
  }

  *:focus:not(:focus-visible) {
    outline: none;
  }

  /* Responsive typography */
  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }
  }

  @media (min-width: 1200px) {
    html {
      font-size: 18px;
    }
  }

  :root {
    --ff-base: var(--font-inter);
    --ff-accent: var(--font-nunito-sans);

    --fs-h1: 2.5rem;
    --fs-h2: 2rem;
    --fs-h3: 1.5rem;
    --fs-h4: 1.25rem;
    --fs-body: 1rem;
    --fs-body-sm: 0.875rem;
    --fs-caption: 0.75rem;
    --fs-button: 0.875rem;

    --lh-heading: 1.25;
    --lh-body: 1.6;
    --lh-button: 1.2;

    --fw-regular: 400;
    --fw-medium: 500;
    --fw-semibold: 600;
    --fw-bold: 700;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await initCsrf(); // 🔑 токен попал в cookie
        setIsHydrated(true);

        dispatch(initializeAuth());
        dispatch(fetchCart()); // GET — безопасно
        dispatch(loadUserProfile());
      } catch (error) {
        console.error('Ошибка инициализации авторизации:', error);
        setIsHydrated(true); // Все равно показываем контент
      }
    })();
  }, [dispatch]);

  // ✅ ИСПРАВЛЕНИЕ: не блокируем SSR — показываем прелоадер как оверлей
  return (
    <>
      {children}
      {!isHydrated && <Preloader />}
    </>
  );
};

function MyApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <Provider store={store}>
      <div className={fontClassNames}>
        <FirstVisitFadeStyles />
        {/* Оверлей и прелоад только на клиенте при первом визите */}
        <FirstVisitBoot maxDelayMs={1200} />
        <Global styles={globalStyles} />

        <GlobalGutters />

        <AuthInitializer>
          <Layout>
            <Component {...props.pageProps} />
          </Layout>

          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AuthInitializer>
      </div>
    </Provider>
  );
}

export default appWithTranslation(MyApp);
