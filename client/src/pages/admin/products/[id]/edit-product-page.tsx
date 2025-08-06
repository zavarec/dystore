import React, { useState, useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

import { ProductsService } from '@/services';
import { Product, UpdateProductDto } from '@/types/models/product.model';
import { toast } from 'react-toastify';
import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { ProductForm } from '@/components/admin/forms/product-form/product-form';

interface EditProductPageProps {
  productId: string;
}

const EditProductPage: NextPage<EditProductPageProps> = ({ productId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [fetchingProduct, setFetchingProduct] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await ProductsService.getProductById(parseInt(productId));
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Продукт не найден');
        router.push('/admin/products');
      } finally {
        setFetchingProduct(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  const handleSubmit = async (data: UpdateProductDto) => {
    setLoading(true);
    try {
      await ProductsService.updateProduct(parseInt(productId), data);
      toast.success('Продукт успешно обновлен');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Ошибка при обновлении продукта');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProduct) {
    return (
      <AdminLayout title="Редактирование продукта">
        <div>Загрузка...</div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout title="Редактирование продукта">
        <div>Продукт не найден</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Редактирование: ${product.name}`}>
      <ProductForm product={product} onSubmit={handleSubmit} loading={loading} />
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const productId = params?.id as string;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ru', ['common'])),
      productId,
    },
  };
};

export default EditProductPage;
