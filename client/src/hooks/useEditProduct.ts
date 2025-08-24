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
      // Собираем только разрешённые сервером поля (без id, isFeatured, popularity, isActive, createdAt, updatedAt, category)
      const payload: Partial<UpdateProductDto> = {};
      if (typeof data.name !== 'undefined') payload.name = data.name;
      if (typeof data.description !== 'undefined') payload.description = data.description;
      if (typeof (data as any).shortDescription !== 'undefined')
        (payload as any).shortDescription = (data as any).shortDescription;
      if (typeof data.price !== 'undefined') payload.price = Number(data.price);
      if (typeof data.stock !== 'undefined') payload.stock = Number(data.stock);
      if (typeof data.imageUrl !== 'undefined') payload.imageUrl = data.imageUrl;
      if (typeof data.categoryId !== 'undefined') payload.categoryId = Number(data.categoryId);

      await ProductsService.updateProduct(parseInt(productId), payload as UpdateProductDto);
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
