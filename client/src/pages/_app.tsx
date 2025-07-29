import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { Global, css } from '@emotion/react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { wrapper } from '@/store';
import { Layout } from '@/components/layout';
import { useAppDispatch } from '@/hooks/redux';
import { loadUserProfile } from '@/store/slices/auth-slice/auth.thunks';
import { initializeAuth } from '@/store/slices/auth-slice/auth.slice';

import 'react-toastify/dist/ReactToastify.css';
import { fetchCart } from '@/store/slices/cart-slice/cart.thunks';

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
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
      'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #ffffff;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden; /* Предотвращаем горизонтальную прокрутку */
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
    outline: 2px solid #007bff;
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

// Компонент для инициализации аутентификации
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   // Инициализируем состояние аутентификации
  //   dispatch(initializeAuth());

  //   // Загружаем корзину из localStorage
  //   dispatch(fetchCart());

  //   // Если пользователь авторизован, загружаем профиль
  //   // Но НЕ на странице авторизации, чтобы избежать зацикливания
  //   const token = localStorage.getItem('access_token');
  //   const isAuthPage =
  //     typeof window !== 'undefined' && window.location.pathname === '/auth';

  //   if (token && !isAuthPage) {
  //     dispatch(loadUserProfile());
  //   }
  // }, [dispatch]);

  useEffect(() => {
    dispatch(initializeAuth());
    dispatch(fetchCart());

    const token = localStorage.getItem('access_token');

    if (token) {
      dispatch(loadUserProfile());
    }
  }, [dispatch]);

  return <>{children}</>;
};

function MyApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <Provider store={store}>
      <Global styles={globalStyles} />
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
    </Provider>
  );
}

export default appWithTranslation(MyApp);
