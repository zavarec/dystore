import React, { useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Package, FolderOpen, ShoppingCart, TrendUp } from '@phosphor-icons/react';
import { ProductsService, CategoriesService } from '@/services';
import { AdminLayout } from '@/components/admin/layout/admin-layout';
import {
  DashboardGrid,
  RecentSection,
  SectionTitle,
  StatCard,
  StatIcon,
  StatInfo,
  StatLabel,
  StatValue,
  StockBadge,
  Table,
  Td,
  Th,
} from '@/styles/pages/admin/admin-dashboard.style';
import { AdminDashboardSkeleton } from '@/components/atoms/skeleton';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  lowStockProducts: number;
  totalValue: number;
}

const AdminDashboard: NextPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    lowStockProducts: 0,
    totalValue: 0,
  });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [products, categories] = await Promise.all([
          ProductsService.getAllProducts(),
          CategoriesService.getAllCategories(),
        ]);

        // Подсчет статистики
        const lowStock = products.filter(p => p.stock < 10).length;
        const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          lowStockProducts: lowStock,
          totalValue: totalValue,
        });

        // Последние 5 продуктов
        setRecentProducts(products.slice(-5).reverse());
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Дашборд">
        <AdminDashboardSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Дашборд">
      <DashboardGrid>
        <StatCard>
          <StatIcon $color="#007bff">
            <Package />
          </StatIcon>
          <StatInfo>
            <StatLabel>Всего продуктов</StatLabel>
            <StatValue>{stats.totalProducts}</StatValue>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon $color="#28a745">
            <FolderOpen />
          </StatIcon>
          <StatInfo>
            <StatLabel>Категорий</StatLabel>
            <StatValue>{stats.totalCategories}</StatValue>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon $color="#dc3545">
            <ShoppingCart />
          </StatIcon>
          <StatInfo>
            <StatLabel>Мало на складе</StatLabel>
            <StatValue>{stats.lowStockProducts}</StatValue>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon $color="#ffc107">
            <TrendUp />
          </StatIcon>
          <StatInfo>
            <StatLabel>Стоимость склада</StatLabel>
            <StatValue>₽{stats.totalValue.toLocaleString()}</StatValue>
          </StatInfo>
        </StatCard>
      </DashboardGrid>

      <RecentSection>
        <SectionTitle>Последние добавленные продукты</SectionTitle>
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Название</Th>
              <Th>Цена</Th>
              <Th>На складе</Th>
              <Th>Статус</Th>
            </tr>
          </thead>
          <tbody>
            {recentProducts.map(product => (
              <tr key={product.id}>
                <Td>{product.id}</Td>
                <Td>{product.name}</Td>
                <Td>₽{product.price.toLocaleString()}</Td>
                <Td>{product.stock} шт.</Td>
                <Td>
                  <StockBadge $inStock={product.stock > 0}>
                    {product.stock > 0 ? 'В наличии' : 'Нет в наличии'}
                  </StockBadge>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </RecentSection>
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
export default withManager(AdminDashboard);
