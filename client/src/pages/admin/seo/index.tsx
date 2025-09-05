import { AdminLayout } from '@/components/admin/layout/admin-layout';
import SeoForm from '@/features/admin/seo';
import { NextPage } from 'next';
import { UserRole } from '@/types/models/user.model';
import { withRoleServerGuard } from '@/lib/withRoleServerGuard';

const Seo: NextPage = () => {
  return (
    <AdminLayout title="SEO настройки">
      <SeoForm />
    </AdminLayout>
  );
};

// Серверная проверка доступа через готовую обёртку
export const getServerSideProps = withRoleServerGuard([UserRole.MANAGER, UserRole.DIRECTOR]);

export default Seo;
