import { useState, useEffect } from 'react';
import { CategoriesService } from '@/services/categories.service';
import { Category } from '@/types/models/category.model';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CategoriesService.getAllCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки категорий');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const refetch = () => {
    fetchCategories();
  };

  return {
    categories,
    loading,
    error,
    refetch,
  };
};

export const useCategory = (id: number) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const data = await CategoriesService.getCategoryById(id);
      setCategory(data);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки категории');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const refetch = () => {
    fetchCategory();
  };

  return {
    category,
    loading,
    error,
    refetch,
  };
};

export const useCategoryBySlug = (slug: string) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryBySlug = async () => {
    if (!slug) return;

    setLoading(true);
    setError(null);
    try {
      const allCategories = await CategoriesService.getAllCategories();
      const foundCategory = allCategories.find(cat => cat.slug === slug);
      setCategory(foundCategory || null);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки категории');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryBySlug();
  }, [slug]);

  const refetch = () => {
    fetchCategoryBySlug();
  };

  return {
    category,
    loading,
    error,
    refetch,
  };
};
