import React, { useState, useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

import { CategoriesService } from '@/services';
import { Category, UpdateCategoryDto } from '@/types/models/category.model';
import { toast } from 'react-toastify';
import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { CategoryForm } from '@/components/admin/forms/category-form/category-form';

interface EditCategoryPageProps {
  categoryId: string;
}

const EditCategoryPage: NextPage<EditCategoryPageProps> = ({ categoryId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [fetchingCategory, setFetchingCategory] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await CategoriesService.getCategoryById(parseInt(categoryId));
        setCategory(data);
      } catch (error) {
        console.error('Error fetching category:', error);
        toast.error('Категория не найдена');
        router.push('/admin/categories');
      } finally {
        setFetchingCategory(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId, router]);

  const handleSubmit = async (data: UpdateCategoryDto) => {
    setLoading(true);
    try {
      await CategoriesService.updateCategory(parseInt(categoryId), data);
      toast.success('Категория успешно обновлена');
      router.push('/admin/categories');
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast.error(error.response?.data?.message || 'Ошибка при обновлении категории');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingCategory) {
    return (
      <AdminLayout title="Редактирование категории">
        <div>Загрузка...</div>
      </AdminLayout>
    );
  }

  if (!category) {
    return (
      <AdminLayout title="Редактирование категории">
        <div>Категория не найдена</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Редактирование: ${category.name}`}>
      <CategoryForm category={category} onSubmit={handleSubmit} loading={loading} />
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const categoryId = params?.id as string;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ru', ['common'])),
      categoryId,
    },
  };
};

export default EditCategoryPage;
