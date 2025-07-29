import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import {
  fetchProductsByCategory,
  fetchProductsByCategoryIncludingDescendants,
} from '@/store/slices/products-slice/products.thunks';
import {
  selectCategoryProductsError,
  selectCategoryProductsIncludingDescendants,
  selectCategoryProductsIncludingDescendantsLoading,
} from '@/store/slices/products-slice/products.selectors';
import {
  clearCategoryProducts,
  clearCategoryError,
} from '@/store/slices/products-slice/products.slice';

export const useCategoryProducts = (categoryId?: number) => {
  const dispatch = useAppDispatch();

  const products = useAppSelector(selectCategoryProductsIncludingDescendants);
  const loading = useAppSelector(selectCategoryProductsIncludingDescendantsLoading);
  const error = useAppSelector(selectCategoryProductsError);

  // Фетчить продукты при изменении categoryId
  useEffect(() => {
    if (categoryId) {
      dispatch(fetchProductsByCategoryIncludingDescendants(categoryId));
    } else {
      // Очищаем продукты если categoryId не задан
      dispatch(clearCategoryProducts());
    }
  }, [dispatch, categoryId]);

  // Очищаем ошибки при размонтировании
  useEffect(() => {
    return () => {
      dispatch(clearCategoryError());
    };
  }, [dispatch]);

  // Функция для рефетча
  const refetch = () => {
    if (categoryId) {
      dispatch(fetchProductsByCategory(categoryId));
    }
  };

  return {
    products,
    loading,
    error,
    refetch,
  };
};
