import React from 'react';
import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { PromotionForm } from '@/features/admin/promotions/promotion-form/promotion-form';
import { PromotionsList } from '@/features/admin/promotions/promotions-list/promotions-list';
import { withManager } from '@/features/auth/with-manager';
import { withRoleServerGuard } from '@/lib/withRoleServerGuard';
import { UserRole } from '@/types/models/user.model';

const AdminPromotionsPage: React.FC = () => {
  return (
    <AdminLayout title="Промо">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <section>
          <h2>Создать промо</h2>
          <PromotionForm />
        </section>
        <section>
          <h2>Активные промо</h2>
          <PromotionsList />
        </section>
      </div>
    </AdminLayout>
  );
};

export default withManager(AdminPromotionsPage);

// export const getServerSideProps = withRoleServerGuard([UserRole.MANAGER, UserRole.DIRECTOR]);
