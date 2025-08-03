// client/src/pages/admin/products/index.tsx
import React, { useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import styled from '@emotion/styled';

import { ProductsService } from '@/services';
import { Product } from '@/types/models/product.model';
import { Pencil, Trash, Plus } from '@phosphor-icons/react';
import { toast } from 'react-toastify';
import { AdminLayout } from '@/components/admin/layout/admin-layout';

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  width: 300px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const AddButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #0056b3;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 16px;
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  color: #495057;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #e9ecef;
  color: #212529;
  font-size: 14px;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`;

const StockBadge = styled.span<{ $inStock: boolean }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.$inStock ? '#d4edda' : '#f8d7da'};
  color: ${props => props.$inStock ? '#155724' : '#721c24'};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ $variant: 'edit' | 'delete' }>`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  transition: all 0.2s ease;
  
  ${props => props.$variant === 'edit' ? `
    background: #ffc107;
    color: #000;
    
    &:hover {
      background: #e0a800;
    }
  ` : `
    background: #dc3545;
    color: white;
    
    &:hover {
      background: #c82333;
    }
  `}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border-top: 1px solid #e9ecef;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${props => props.$active ? '#007bff' : '#ddd'};
  background: ${props => props.$active ? '#007bff' : 'white'};
  color: ${props => props.$active ? 'white' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.$active ? '#0056b3' : '#f8f9fa'};
    border-color: ${props => props.$active ? '#0056b3' : '#ccc'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

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
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          onChange={(e) => setSearchQuery(e.target.value)}
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
                        <ActionButton 
                          $variant="delete"
                          onClick={() => handleDelete(product.id)}
                        >
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