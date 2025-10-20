import { useEffect, useState } from 'react';

import type { GetServerSideProps, NextPage } from 'next';

import Link from 'next/link';

import { Pencil, Trash, Plus } from '@phosphor-icons/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { toast } from 'react-toastify';

import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { TableRowSkeleton } from '@/components/atoms/skeleton';
import { withManager } from '@/features/auth/with-manager';
import { ProductsService } from '@/services';
import {
  ActionsBar as SActionsBar,
  SearchInput as SSearchInput,
  AddButton as SAddButton,
  TableContainer as STableContainer,
  Table as STable,
  Th as STh,
  Td as STd,
  ProductImage as SProductImage,
  StockBadge as SStockBadge,
  ActionButtons as SActionButtons,
  ActionButton as SActionButton,
  EmptyState as SEmptyState,
  Pagination as SPagination,
  PageButton as SPageButton,
} from '@/styles/pages/admin/admin-products-page.style';
import type { Product } from '@/types/models/product.model';

const AdminProductsPage: NextPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Фильтрация продуктов по поисковому запросу
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Сброс на первую страницу при поиске
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      const data = await ProductsService.getAllProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Ошибка загрузки продуктов');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот продукт?')) {
      return;
    }

    try {
      await ProductsService.deleteProduct(id);
      toast.success('Продукт успешно удален');
      fetchProducts(); // Перезагрузка списка
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Ошибка при удалении продукта');
    }
  };

  // Пагинация
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  if (loading) {
    return (
      <AdminLayout title="Продукты">
        <STableContainer>
          <STable>
            <thead>
              <tr>
                <STh>ID</STh>
                <STh>Изображение</STh>
                <STh>Название</STh>
                <STh>Категория</STh>
                <STh>Цена</STh>
                <STh>На складе</STh>
                <STh>Статус</STh>
                <STh>Действия</STh>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }).map((_, i) => (
                <TableRowSkeleton key={i} columns={8} />
              ))}
            </tbody>
          </STable>
        </STableContainer>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Продукты">
      <SActionsBar>
        <SSearchInput
          type="text"
          placeholder="Поиск продуктов..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <Link href="/admin/products/new" passHref legacyBehavior>
          <SAddButton>
            <Plus size={20} />
            Добавить продукт
          </SAddButton>
        </Link>
      </SActionsBar>

      <STableContainer>
        {currentProducts.length === 0 ? (
          <SEmptyState>
            <p>Продукты не найдены</p>
          </SEmptyState>
        ) : (
          <>
            <STable>
              <thead>
                <tr>
                  <STh>ID</STh>
                  <STh>Изображение</STh>
                  <STh>Название</STh>
                  <STh>Категория</STh>
                  <STh>Цена</STh>
                  <STh>На складе</STh>
                  <STh>Статус</STh>
                  <STh>Действия</STh>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map(product => (
                  <tr key={product.id}>
                    <STd>{product.id}</STd>
                    <STd>
                      <SProductImage
                        src={product.mainImage?.url || '/images/placeholder.webp'}
                        alt={product.name}
                      />
                    </STd>
                    <STd>{product.name}</STd>
                    <STd>{product.category?.name || 'Без категории'}</STd>
                    <STd>₽{product.price.toLocaleString()}</STd>
                    <STd>{product.stock} шт.</STd>
                    <STd>
                      <SStockBadge $inStock={product.stock > 0}>
                        {product.stock > 0 ? 'В наличии' : 'Нет в наличии'}
                      </SStockBadge>
                    </STd>
                    <STd>
                      <SActionButtons>
                        <Link href={`/admin/products/${product.id}/edit`} passHref legacyBehavior>
                          <SActionButton as="a" $variant="edit">
                            <Pencil size={16} />
                            Изменить
                          </SActionButton>
                        </Link>
                        <SActionButton $variant="delete" onClick={() => handleDelete(product.id)}>
                          <Trash size={16} />
                          Удалить
                        </SActionButton>
                      </SActionButtons>
                    </STd>
                  </tr>
                ))}
              </tbody>
            </STable>

            {totalPages > 1 && (
              <SPagination>
                <SPageButton
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Назад
                </SPageButton>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <SPageButton
                    key={page}
                    $active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </SPageButton>
                ))}

                <SPageButton
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Вперед
                </SPageButton>
              </SPagination>
            )}
          </>
        )}
      </STableContainer>
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
export default withManager(AdminProductsPage);
