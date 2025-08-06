// // client/src/utils/admin/auth.ts
// import { GetServerSidePropsContext } from 'next';
// import { apiClient } from '@/services/api';

// /**
//  * Проверяет авторизацию и права администратора
//  * Используется в getServerSideProps для защиты админских страниц
//  */
// export const requireAdminAuth = async (context: GetServerSidePropsContext) => {
//   const token = context.req.cookies['access_token'];

//   if (!token) {
//     return {
//       redirect: {
//         destination: '/admin/login',
//         permanent: false,
//       },
//     };
//   }

//   try {
//     // Проверяем валидность токена
//     const response = await apiClient.get('/auth/profile', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const user = response.data;

//     // Здесь можно добавить проверку роли администратора
//     // if (!user.isAdmin) {
//     //   return {
//     //     redirect: {
//     //       destination: '/',
//     //       permanent: false,
//     //     },
//     //   };
//     // }

//     return { props: { user } };
//   } catch (error) {
//     return {
//       redirect: {
//         destination: '/admin/login',
//         permanent: false,
//       },
//     };
//   }
// };

// /**
//  * HOC для защиты админских страниц на клиенте
//  */
// import { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { useAppSelector } from '@/hooks/redux';
// import { selectIsAuthenticated } from '@/store/slices/auth-slice/auth.selectors';

// export const withAdminAuth = <P extends object>(Component: React.ComponentType<P>) => {
//   return (props: P) => {
//     const router = useRouter();
//     const isAuthenticated = useAppSelector(selectIsAuthenticated);

//     useEffect(() => {
//       if (!isAuthenticated) {
//         router.push('/admin/login');
//       }
//     }, [isAuthenticated, router]);

//     if (!isAuthenticated) {
//       return <div>Загрузка...</div>;
//     }

//     return <Component {...props} />;
//   };
// };