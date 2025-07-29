import React, { useState, useMemo } from 'react';
import { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { SEOHead } from '@/components/atoms/seo-head/seo-head';
import { ProductWithDetails, ProductSortBy } from '@/types/models/product.model';
import { useCategoryBySlug, useCategoryProducts } from '@/hooks';
import { adaptProductsForUI } from '@/utils/product-adapters';
import { ProductSection } from '@/components/sections/product-section';
import {
  Container,
  Header,
  CategoryTitle,
  CategoryDescription,
  FiltersBar,
  FilterGroup,
  FilterLabel,
  Select,
  ProductsCount,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
} from '@/styles/pages/category-slug.style';

interface CategoryPageProps {
  slug: string;
}

const CategoryPage: NextPage<CategoryPageProps> = ({ slug }) => {
  const [sortBy, setSortBy] = useState<ProductSortBy>(ProductSortBy.POPULARITY);

  // Получаем данные с API
  const { category, loading: categoryLoading } = useCategoryBySlug(slug);
  const { products: rawCategoryProducts, loading: productsLoading } = useCategoryProducts(
    category?.id,
  );

  // Адаптируем продукты для UI
  const categoryProducts = useMemo(() => {
    return adaptProductsForUI(rawCategoryProducts);
  }, [rawCategoryProducts]);

  // Сортировка продуктов
  const sortedProducts = useMemo(() => {
    const sorted = [...categoryProducts];

    switch (sortBy) {
      case ProductSortBy.PRICE_LOW_TO_HIGH:
        return sorted.sort((a, b) => a.price - b.price);
      case ProductSortBy.PRICE_HIGH_TO_LOW:
        return sorted.sort((a, b) => b.price - a.price);
      case ProductSortBy.RATING:
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case ProductSortBy.NEWEST:
        return sorted.sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
        );
      case ProductSortBy.NAME:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case ProductSortBy.POPULARITY:
      default:
        return sorted.sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        });
    }
  }, [categoryProducts, sortBy]);

  const loading = productsLoading || categoryLoading;
  const categoryName = category?.name || 'Категория';
  const categoryDescription = `Товары категории ${categoryName}`;

  // SEO данные
  const seoData = {
    title: `${categoryName} - DyStore`,
    description: `${categoryDescription}. Официальная гарантия, быстрая доставка.`,
    canonical: `https://dystore.ru/category/${slug}`,
  };

  return (
    <>
      <SEOHead {...seoData} />

      <Container>
        <Header>
          <div>
            <nav style={{ marginBottom: '16px' }}>
              <Link href="/" style={{ color: '#666', textDecoration: 'none' }}>
                Главная
              </Link>
              <span style={{ margin: '0 8px', color: '#666' }}>/</span>
              <span style={{ color: '#333' }}>{categoryName}</span>
            </nav>

            <CategoryTitle>{categoryName}</CategoryTitle>
            <CategoryDescription>{categoryDescription}</CategoryDescription>
          </div>
        </Header>

        <FiltersBar>
          <FilterGroup>
            <FilterLabel>Товаров найдено:</FilterLabel>
            <ProductsCount>{loading ? '...' : sortedProducts.length}</ProductsCount>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Сортировка:</FilterLabel>
            <Select value={sortBy} onChange={e => setSortBy(e.target.value as ProductSortBy)}>
              <option value={ProductSortBy.POPULARITY}>По популярности</option>
              <option value={ProductSortBy.PRICE_LOW_TO_HIGH}>По цене: по возрастанию</option>
              <option value={ProductSortBy.PRICE_HIGH_TO_LOW}>По цене: по убыванию</option>
              <option value={ProductSortBy.RATING}>По рейтингу</option>
              <option value={ProductSortBy.NEWEST}>Новинки</option>
              <option value={ProductSortBy.NAME}>По названию</option>
            </Select>
          </FilterGroup>
        </FiltersBar>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Загрузка товаров...</div>
        ) : sortedProducts.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🔍</EmptyIcon>
            <EmptyTitle>Товары не найдены</EmptyTitle>
            <EmptyDescription>В данной категории пока нет товаров</EmptyDescription>
          </EmptyState>
        ) : (
          <ProductSection title="" products={sortedProducts} variant="primary" />
        )}
      </Container>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  // Возможные slug'и категорий
  const categorySlugs = ['vacuum-cleaners', 'hair-care', 'climate-tech', 'hand-dryers'];

  const paths = categorySlugs.flatMap(slug =>
    (locales || ['ru']).map(locale => ({
      params: { slug },
      locale,
    })),
  );

  return {
    paths,
    fallback: 'blocking', // Генерируем страницы на лету для новых категорий
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = params?.slug as string;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ru', ['common'])),
      slug,
    },
    revalidate: 3600, // Перегенерация каждый час
  };
};

export default CategoryPage;
