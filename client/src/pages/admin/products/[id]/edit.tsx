import type { GetServerSideProps, NextPage } from 'next';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { ProductForm } from '@/components/admin/forms/product-form/product-form';
import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { withManager } from '@/features/auth/with-manager';
import { useEditProduct } from '@/hooks/useEditProduct';

interface EditProductPageProps {
  productId: string;
}

const EditProductPage: NextPage<EditProductPageProps> = ({ productId }) => {
  const { product, handleSubmit, loading, fetchingProduct } = useEditProduct(productId);

  if (fetchingProduct) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout title="Редактирование продукта">
      {product && (
        <ProductForm onSubmit={handleSubmit} loading={loading} initialValues={product} isEdit />
      )}
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, params }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ru', ['common'])),
      productId: params?.id || '',
    },
  };
};
export default withManager<EditProductPageProps>(EditProductPage);
