// client/src/pages/admin/products/new.tsx
import React, { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

import { ProductsService } from '@/services';
import { CreateProductDto, UpdateProductDto } from '@/types/models/product.model';
import { toast } from 'react-toastify';
import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { ProductForm } from '@/components/admin/forms/product-form/product-form';

const NewProductPage: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreateProductDto | UpdateProductDto) => {
    setLoading(true);
    try {
      await ProductsService.createProduct(data as CreateProductDto);
      toast.success('Продукт успешно создан');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(error.response?.data?.message || 'Ошибка при создании продукта');
    } finally {
      setLoading(false);
    }
  };

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
