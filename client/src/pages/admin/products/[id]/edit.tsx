import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { useEditProduct } from '@/hooks/useEditProduct';
import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { ProductForm } from '@/components/admin/forms/product-form/product-form';

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

import { withAdmin } from '@/features/auth/with-admin';
export default withAdmin<EditProductPageProps>(EditProductPage);
