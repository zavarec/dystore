import useSWR from 'swr';
import { ProductsService } from '@/services/products.service';
import { Product } from '@/types/models/product.model';

export const useProducts = () => {
  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    '/products',
    () => ProductsService.getAllProducts(),
    {
      revalidateOnFocus: false,
      refreshInterval: 5 * 60 * 1000, // 5 минут
      dedupingInterval: 60 * 1000, // 1 минута
    },
  );

  const refetch = () => mutate();

  return {
    products: data || [],
    loading: isLoading,
    error,
    refetch,
  };
};

export const useProduct = (id: number) => {
  const shouldFetch = Boolean(id);
  const { data, error, isLoading, mutate } = useSWR<Product>(
    shouldFetch ? ['/products', id] : null,
    () => ProductsService.getProductById(id),
    {
      revalidateOnFocus: false,
      dedupingInterval: 2 * 60 * 1000, // 2 минуты
    },
  );

  const refetch = () => mutate();

  return {
    product: data || null,
    loading: isLoading,
    error,
    refetch,
  };
};

export const useProductsByCategory = (categoryId: number) => {
  const shouldFetch = Boolean(categoryId);
  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    shouldFetch ? ['/categories', categoryId, 'products-with-descendants'] : null,
    () => ProductsService.getProductsByCategoryIncludingDescendants(categoryId),
    {
      revalidateOnFocus: false,
      refreshInterval: 3 * 60 * 1000, // 3 минуты
      dedupingInterval: 60 * 1000, // 1 минута
    },
  );

  const refetch = () => mutate();

  return {
    products: data || [],
    loading: isLoading,
    error,
    refetch,
  };
};
