import dynamic from 'next/dynamic';

const HomeLayoutEditor = dynamic(() => import('@/features/admin/layout/home-layout-editor'), {
  ssr: false,
});

export default function AdminLayoutPage() {
  return <HomeLayoutEditor />;
}
