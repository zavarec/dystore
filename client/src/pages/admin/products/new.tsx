import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { useNewProduct } from '@/hooks/useNewProduct';
import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { ProductForm } from '@/components/admin/forms/product-form/product-form';

const NewProductPage: NextPage = () => {
  const { handleSubmit, loading } = useNewProduct();

  return (
    <AdminLayout title="Создание продукта">
      <ProductForm onSubmit={handleSubmit} loading={loading} />
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ru', ['common'])),
    },
  };
};

export default NewProductPage;
