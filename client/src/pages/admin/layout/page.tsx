import dynamic from 'next/dynamic';
import React from 'react';

const HomeLayoutEditor = dynamic(() => import('@/features/admin/layout/home-layout-editor'), {
  ssr: false,
});

export default function AdminLayoutPage() {
  return <HomeLayoutEditor />;
}
