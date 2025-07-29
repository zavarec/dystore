import { useState, useEffect } from 'react';
import { ProductsService } from '@/services/products.service';
import { Product } from '@/types/models/product.model';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProductsService.getAllProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки продуктов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const refetch = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    refetch,
  };
};

export const useProduct = (id: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const data = await ProductsService.getProductById(id);
      setProduct(data);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки продукта');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const refetch = () => {
    fetchProduct();
  };

  return {
    product,
    loading,
    error,
    refetch,
  };
};

export const useProductsByCategory = (categoryId: number) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductsByCategory = async () => {
    if (!categoryId) return;

    setLoading(true);
    setError(null);
    try {
      const allProducts = await ProductsService.getAllProducts();
      const filteredProducts = allProducts.filter(product => product.categoryId === categoryId);
      setProducts(filteredProducts);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки продуктов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsByCategory();
  }, [categoryId]);

  const refetch = () => {
    fetchProductsByCategory();
  };

  return {
    products,
    loading,
    error,
    refetch,
  };
};
