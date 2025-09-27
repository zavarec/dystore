import useSWR from 'swr';

import { ProductsService } from '@/services/products.service';
import type { Product } from '@/types/models/product.model';

interface UseCategoryProductsProps {
  categoryId?: number | undefined;
  options?: { enabled: boolean; initialData?: Product[] };
}

export const useCategoryProducts = ({ categoryId, options }: UseCategoryProductsProps) => {
  const shouldFetch = Boolean(categoryId) && options?.enabled;

  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    shouldFetch ? ['/categories', categoryId, 'products'] : null,
    () => ProductsService.getProductsByCategory(categoryId as number),
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
