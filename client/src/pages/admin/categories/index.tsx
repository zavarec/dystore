import React, { useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { CategoriesService } from '@/services';
import { Category } from '@/types/models/category.model';
import { Pencil, Trash, Plus, FolderOpen } from '@phosphor-icons/react';
import { toast } from 'react-toastify';

import {
  ActionsBar,
  AddButton,
  CategoriesContainer,
  CategoryItem,
  CategoryInfo,
  CategoryIcon,
  CategoryName,
  CategoryMeta,
  ActionButtons,
  ActionButton,
  EmptyState,
} from '@/styles/pages/admin/admin-categories-page.style';

const AdminCategoriesPage: NextPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await CategoriesService.getCategoryTree();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Ошибка загрузки категорий');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены? Все подкатегории также будут удалены.')) {
      return;
    }

    try {
      await CategoriesService.deleteCategory(id);
      toast.success('Категория успешно удалена');
      fetchCategories(); // Перезагрузка списка
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Ошибка при удалении категории');
    }
  };

  // Рекурсивный рендер категорий
  const renderCategories = (categories: Category[], level = 0) => {
    return categories.map(category => (
      <React.Fragment key={category.id}>
        <CategoryItem $level={level}>
          <CategoryInfo>
            <CategoryIcon>
              <FolderOpen size={20} />
            </CategoryIcon>
            <CategoryName>{category.name}</CategoryName>
          </CategoryInfo>

          <CategoryMeta>
            <span>ID: {category.id}</span>
            <span>Slug: {category.slug}</span>
            {category.children && category.children.length > 0 && (
              <span>Подкатегорий: {category.children.length}</span>
            )}
            <ActionButtons>
              <Link href={`/admin/categories/${category.id}/edit`} passHref legacyBehavior>
                <ActionButton as="a" $variant="edit">
                  <Pencil size={16} />
                  Изменить
                </ActionButton>
              </Link>
              <ActionButton $variant="delete" onClick={() => handleDelete(category.id)}>
                <Trash size={16} />
                Удалить
              </ActionButton>
            </ActionButtons>
          </CategoryMeta>
        </CategoryItem>

        {category.children &&
          category.children.length > 0 &&
          renderCategories(category.children, level + 1)}
      </React.Fragment>
    ));
  };

  if (loading) {
    return (
      <AdminLayout title="Категории">
        <div>Загрузка...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Категории">
      <ActionsBar>
        <Link href="/admin/categories/new" passHref legacyBehavior>
          <AddButton>
            <Plus size={20} />
            Добавить категорию
          </AddButton>
        </Link>
        <Link href="/admin/categories/promo-sections" passHref legacyBehavior>
          <AddButton>Управление промо-секциями</AddButton>
        </Link>
      </ActionsBar>

      <CategoriesContainer>
        {categories.length === 0 ? (
          <EmptyState>
            <p>Категории не найдены</p>
          </EmptyState>
        ) : (
          renderCategories(categories)
        )}
      </CategoriesContainer>
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

import { withManager } from '@/features/auth/with-manager';
export default withManager(AdminCategoriesPage);
