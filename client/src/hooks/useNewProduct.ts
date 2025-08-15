import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { ProductsService } from '@/services';
import { CreateProductDto, UpdateProductDto } from '@/types/models/product.model';

export const useNewProduct = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreateProductDto | UpdateProductDto) => {
    setLoading(true);
    try {
      await ProductsService.createProduct(data as CreateProductDto);
      toast.success('Продукт успешно создан');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(error.response?.data?.message || 'Ошибка при создании продукта');
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading };
};
