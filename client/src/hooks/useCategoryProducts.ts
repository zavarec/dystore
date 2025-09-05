import useSWR from 'swr';
import { ProductsService } from '@/services/products.service';
import { Product } from '@/types/models/product.model';

export const useCategoryProducts = (categoryId?: number) => {
  const shouldFetch = Boolean(categoryId);
  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    shouldFetch ? ['/categories', categoryId, 'products-with-descendants'] : null,
    () => ProductsService.getProductsByCategoryIncludingDescendants(categoryId as number),
    {
      revalidateOnFocus: false,
      refreshInterval: 3 * 60 * 1000,
      dedupingInterval: 60 * 1000,
    },
  );

  console.log(data, 'DATA');

  const refetch = () => mutate();

  return {
    products: data || [],
    loading: isLoading,
    error,
    refetch,
  };
};
