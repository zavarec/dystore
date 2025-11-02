import useSWR from 'swr';

import { ProductSortBy, type Product } from '@/types/models/product.model';

const API = process.env.NEXT_PUBLIC_API_URL || '/api/proxy';

type Resp = { total: number; page: number; pages: number; items: Product[] };

const fetcher = async (
  _: string,
  slug: string,
  deep: boolean,
  page: number,
  limit: number,
  sort: ProductSortBy,
) => {
  // Проверяем валидность параметров
  if (!slug || slug === 'undefined') {
    throw new Error('Invalid parameters: slug is undefined');
  }

  // Устанавливаем значения по умолчанию для page и limit
  const validPage = page || 1;
  const validLimit = limit || 24;

  // Преобразуем enum в строковое значение для API
  const sortValue =
    sort === ProductSortBy.PRICE_LOW_TO_HIGH
      ? 'price-asc'
      : sort === ProductSortBy.PRICE_HIGH_TO_LOW
        ? 'price-desc'
        : sort === ProductSortBy.RATING
          ? 'rating'
          : sort === ProductSortBy.NEWEST
            ? 'newest'
            : sort === ProductSortBy.NAME
              ? 'name'
              : 'popularity';

  const url = `${API}/categories/${slug}/products?deep=${deep ? 'true' : 'false'}&page=${validPage}&limit=${validLimit}&sort=${sortValue}`;
  console.log('Fetching products from:', url);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data as Resp;
};

export function useCategoryProductsDeep(params: {
  slug?: string;
  deep?: boolean;
  page?: number;
  limit?: number;
  sort?: ProductSortBy;
  initialData?: Resp | null;
}) {
  const {
    slug,
    deep = true,
    page = 1,
    limit = 24,
    sort = ProductSortBy.POPULARITY,
    initialData,
  } = params;

  // Убеждаемся, что параметры определены
  const validPage = page || 1;
  const validLimit = limit || 24;
  const key =
    slug && slug !== 'undefined'
      ? ['categoryDeepProducts', slug, deep, validPage, validLimit, sort]
      : null;

  const { data, error, isValidating, mutate } = useSWR<Resp>(
    key,
    key
      ? () =>
          fetcher(
            key[0] as string,
            key[1] as string,
            key[2] as boolean,
            key[3] as number,
            key[4] as number,
            key[5] as ProductSortBy,
          )
      : null,
    {
      ...(initialData && { fallbackData: initialData }),
      revalidateOnFocus: false,
    },
  );

  return {
    data,
    products: data?.items ?? [],
    total: data?.total ?? 0,
    pages: data?.pages ?? 1,
    loading: key ? (!data && !error) || isValidating : false,
    error,
    refresh: mutate,
  };
}
