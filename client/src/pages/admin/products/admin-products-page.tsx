// client/src/pages/admin/products/index.tsx
import React, { useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';

import { ProductsService } from '@/services';
import { Product } from '@/types/models/product.model';
import { Pencil, Trash, Plus } from '@phosphor-icons/react';
import { toast } from 'react-toastify';
import { AdminLayout } from '@/components/admin/layout/admin-layout';
import {
  ActionsBar,
  SearchInput,
  AddButton,
  TableContainer,
  Table,
  Th,
  Td,
  ProductImage,
  StockBadge,
  ActionButtons,
  ActionButton,
  EmptyState,
  Pagination,
  PageButton,
} from './admin-products-page.style';

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
        <div>Загрузка...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Продукты">
      <ActionsBar>
        <SearchInput
          type="text"
          placeholder="Поиск продуктов..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <Link href="/admin/products/new" passHref legacyBehavior>
          <AddButton>
            <Plus size={20} />
            Добавить продукт
          </AddButton>
        </Link>
      </ActionsBar>

      <TableContainer>
        {currentProducts.length === 0 ? (
          <EmptyState>
            <p>Продукты не найдены</p>
          </EmptyState>
        ) : (
          <>
            <Table>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Изображение</Th>
                  <Th>Название</Th>
                  <Th>Категория</Th>
                  <Th>Цена</Th>
                  <Th>На складе</Th>
                  <Th>Статус</Th>
                  <Th>Действия</Th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map(product => (
                  <tr key={product.id}>
                    <Td>{product.id}</Td>
                    <Td>
                      <ProductImage
                        src={product.imageUrl || '/images/placeholder.webp'}
                        alt={product.name}
                      />
                    </Td>
                    <Td>{product.name}</Td>
                    <Td>{product.category?.name || 'Без категории'}</Td>
                    <Td>₽{product.price.toLocaleString()}</Td>
                    <Td>{product.stock} шт.</Td>
                    <Td>
                      <StockBadge $inStock={product.stock > 0}>
                        {product.stock > 0 ? 'В наличии' : 'Нет в наличии'}
                      </StockBadge>
                    </Td>
                    <Td>
                      <ActionButtons>
                        <Link href={`/admin/products/${product.id}/edit`} passHref legacyBehavior>
                          <ActionButton as="a" $variant="edit">
                            <Pencil size={16} />
                            Изменить
                          </ActionButton>
                        </Link>
                        <ActionButton $variant="delete" onClick={() => handleDelete(product.id)}>
                          <Trash size={16} />
                          Удалить
                        </ActionButton>
                      </ActionButtons>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {totalPages > 1 && (
              <Pagination>
                <PageButton
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Назад
                </PageButton>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PageButton
                    key={page}
                    $active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PageButton>
                ))}

                <PageButton
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Вперед
                </PageButton>
              </Pagination>
            )}
          </>
        )}
      </TableContainer>
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

export default AdminProductsPage;
