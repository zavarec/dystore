import useSWR from 'swr';
import { CategoriesService } from '@/services/categories.service';
import { Category } from '@/types/models/category.model';

export const useCategories = () => {
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    '/categories',
    () => CategoriesService.getAllCategories(),
    {
      revalidateOnFocus: false,
      refreshInterval: 10 * 60 * 1000, // 10 минут
      dedupingInterval: 2 * 60 * 1000, // 2 минуты
    },
  );

  const refetch = () => mutate();

  return {
    categories: data || [],
    loading: isLoading,
    error,
    refetch,
  };
};

export const useCategory = (id: number) => {
  const shouldFetch = Boolean(id);
  const { data, error, isLoading, mutate } = useSWR<Category>(
    shouldFetch ? ['/categories', id] : null,
    () => CategoriesService.getCategoryById(id),
    {
      revalidateOnFocus: false,
      dedupingInterval: 2 * 60 * 1000,
    },
  );

  const refetch = () => mutate();

  return {
    category: data || null,
    loading: isLoading,
    error,
    refetch,
  };
};

export const useCategoryBySlug = (slug: string) => {
  const shouldFetch = Boolean(slug);
  const { data, error, isLoading, mutate } = useSWR<Category | null>(
    shouldFetch ? ['/categories/by-slug', slug] : null,
    async () => {
      const all = await CategoriesService.getAllCategories();
      return all.find(cat => cat.slug === slug) || null;
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 10 * 60 * 1000,
      dedupingInterval: 2 * 60 * 1000,
    },
  );

  const refetch = () => mutate();

  return {
    category: data || null,
    loading: isLoading,
    error,
    refetch,
  };
};
