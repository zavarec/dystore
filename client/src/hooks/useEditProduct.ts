import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';

import { ProductsService } from '@/services';
import type { Product, UpdateProductDto } from '@/types/models/product.model';

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
      const payload: Partial<UpdateProductDto> = {};
      if (typeof data.name !== 'undefined') payload.name = data.name;
      if (typeof data.description !== 'undefined') payload.description = data.description;
      if (typeof data.shortDescription !== 'undefined')
        payload.shortDescription = data.shortDescription;
      if (typeof data.price !== 'undefined') payload.price = Number(data.price);
      if (typeof data.stock !== 'undefined') payload.stock = Number(data.stock);
      if (typeof data.mainImageId !== 'undefined') payload.mainImageId = data.mainImageId;
      if (typeof data.categoryId !== 'undefined') payload.categoryId = Number(data.categoryId);
      if (typeof data.boxItems !== 'undefined') payload.boxItems = data.boxItems;
      if (typeof data.specs !== 'undefined') payload.specs = data.specs;
      if (typeof data.dimensionsImageId !== 'undefined')
        payload.dimensionsImageId = data.dimensionsImageId;
      if (typeof data.isFeatured !== 'undefined' && data.isFeatured)
        payload.isFeatured = Boolean(data.isFeatured);
      if (typeof data.slug !== 'undefined') payload.slug = data.slug;

      if (typeof data.motifId !== 'undefined' && data.motifId) payload.motifId = data.motifId;
      if (typeof data.keyFeatures !== 'undefined') payload.keyFeatures = data.keyFeatures;

      await ProductsService.updateProduct(parseInt(productId), payload as UpdateProductDto);
      toast.success('Продукт успешно обновлен');
      router.push('/admin/products');
      const slug = data.slug ?? product?.slug;
      if (slug) {
        await fetch(`${process.env.NEXT_PUBLIC_WEB_URL}/api/revalidate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret: process.env.REVALIDATE_SECRET, slug }),
        });
      } else {
        console.warn('Product slug is missing, skipping revalidation.');
      }
    } catch (error: unknown) {
      console.error('Error updating product:', error);

      toast.error(
        isAxiosError(error) ? error?.response?.statusText : 'Ошибка при обновлении продукта',
      );
    } finally {
      setLoading(false);
    }
  };

  return { product, handleSubmit, loading, fetchingProduct };
};
