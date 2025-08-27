import React, { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

import { CategoriesService } from '@/services';
import { CreateCategoryDto } from '@/types/models/category.model';
import { toast } from 'react-toastify';
import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { CategoryForm } from '@/components/admin/forms/category-form/category-form';

const NewCategoryPage: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreateCategoryDto) => {
    setLoading(true);
    try {
      await CategoriesService.createCategory(data);
      toast.success('Категория успешно создана');
      router.push('/admin/categories');
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast.error(error.response?.data?.message || 'Ошибка при создании категории');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Создание категории">
      <CategoryForm<CreateCategoryDto> onSubmit={handleSubmit} loading={loading} />
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

import { withAdmin } from '@/features/auth/with-admin';
export default withAdmin(NewCategoryPage);
