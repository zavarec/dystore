import type { NextPage } from 'next';

import dynamic from 'next/dynamic';

import { AdminLayout } from '@/components/admin/layout/admin-layout';

const PromoSectionsBoard = dynamic(
  () =>
    import('@/features/admin/promo/promo-sections/promo-sections-board').then(
      m => m.PromoSectionsBoard,
    ),
  { ssr: false },
);
const PromoPlacementsBoard = dynamic(
  () =>
    import('@/features/admin/promo/promo-placements/promo-placements-board').then(
      m => m.PromoPlacementsBoard,
    ),
  { ssr: false },
);

const PromoPage: NextPage = () => {
  return (
    <AdminLayout title="Промо">
      <PromoSectionsBoard />
      <div style={{ height: 24 }} />
      <PromoPlacementsBoard />
    </AdminLayout>
  );
};

export default PromoPage;
