// pages/admin/products/new.tsx
import React from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';

import { useNewProduct } from '@/hooks/useNewProduct';
import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { ProductForm } from '@/components/admin/forms/product-form/product-form';

const NewProductPage: NextPage = () => {
  const { t } = useTranslation('common');
  const { handleSubmit, loading } = useNewProduct();

  return (
    <AdminLayout title={t('createProduct', 'Создание продукта')}>
      <ProductForm onSubmit={handleSubmit} loading={loading} />
    </AdminLayout>
  );
};

import { withManager } from '@/features/auth/with-manager';
export default withManager(NewProductPage);
