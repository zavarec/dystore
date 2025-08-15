import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { ProductsService } from '@/services';
import { Product, UpdateProductDto } from '@/types/models/product.model';

export const useEditProduct = (productId: string) => {
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

  return { product, handleSubmit, loading, fetchingProduct };
};
