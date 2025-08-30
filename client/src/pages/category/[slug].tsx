import React, { useState, useMemo, useCallback } from 'react';
import { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SEOHead } from '@/components/atoms/seo-head/seo-head';
import { ProductSortBy } from '@/types/models/product.model';
import { useCategoryBySlug, useCategoryProducts } from '@/hooks';
import { adaptProductsForUI } from '@/utils/product-adapters';
import { ProductSection } from '@/components/sections/product-section';
import { useEffect } from 'react';
import { CategoryPromoPlacement } from '@/types/models/category-promo-section.model';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchCategoryPromoSectionsBySlug } from '@/store/slices/category-promo-sections/category-promo-sections.thunks';
import { makeSelectCategoryPromoSectionsBySlug } from '@/store/slices/category-promo-sections/category-promo-sections.selectors';
import { VideoBanner } from '@/components/atoms/video-banner';
import { Button } from '@/components/atoms/button';
import { ButtonVariant } from '@/components/atoms/button/button.style';
import { categoryVideoMap } from './category-video-map';
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

import { HorizontalScroller } from '@/components/atoms/horizontal-scroller/horizontal-scroller';
import { CategoryCard } from '@/components/sections/categories/components';
import { PromoBlock } from '@/features/promo-block/promo-block';

interface CategoryPageProps {
  slug: string;
}

const CategoryPage: NextPage<CategoryPageProps> = ({ slug }) => {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<ProductSortBy>(ProductSortBy.POPULARITY);

  const dispatch = useAppDispatch();

  const promoSections = useAppSelector(makeSelectCategoryPromoSectionsBySlug(slug));

  const { category, loading: categoryLoading } = useCategoryBySlug(slug);
  const hasChildren = !!category?.children && category.children.length > 0;
  const { products: rawCategoryProducts, loading: productsLoading } = useCategoryProducts(
    hasChildren ? undefined : category?.id,
  );

  // Адаптируем продукты для UI
  const categoryProducts = useMemo(() => {
    return adaptProductsForUI(rawCategoryProducts);
  }, [rawCategoryProducts]);

  // грузим промо-секции категории через стор
  useEffect(() => {
    dispatch(fetchCategoryPromoSectionsBySlug(slug) as any);
  }, [dispatch, slug]);

  // выше/ниже считаем через сгруппированный объект promoByPlacement

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

  const loading = categoryLoading || (!hasChildren && productsLoading);
  const categoryName = category?.name || 'Категория';
  const categoryDescription = hasChildren
    ? `Выберите подкатегорию раздела «${categoryName}»`
    : `Товары категории ${categoryName}`;
  const categoryVideoSrc = categoryVideoMap[slug];

  const handleCategoryClick = useCallback(
    (subcategorySlug: string) => {
      router.push(`/category/${subcategorySlug}`);
    },
    [router],
  );

  const scrollToSubcategories = useCallback(() => {
    const el = document.getElementById('subcategories');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const promoByPlacement = useMemo(() => {
    return promoSections.reduce<Record<CategoryPromoPlacement, typeof promoSections>>(
      (acc, section) => {
        (acc[section.placement] ||= []).push(section);
        return acc;
      },
      {} as any,
    );
  }, [promoSections]);

  // SEO данные
  const seoData = {
    title: `${categoryName} - DyStore`,
    description: `${categoryDescription}. Официальная гарантия, быстрая доставка.`,
    canonical: `https://dystore.ru/category/${slug}`,
  };

  return (
    <>
      <SEOHead {...seoData} />

      {promoByPlacement.ABOVE_HERO && <PromoBlock sections={promoByPlacement.ABOVE_HERO} />}

      {hasChildren && (
        <VideoBanner
          height="60vh"
          {...(categoryVideoSrc ? { src: categoryVideoSrc } : {})}
          {...(!categoryVideoSrc && category?.image ? { backgroundImage: category.image } : {})}
        >
          <h1 style={{ fontSize: '2.2rem', marginBottom: 12 }}>{categoryName}</h1>
          <p style={{ opacity: 0.9, marginBottom: 16 }}>{categoryDescription}</p>
          <Button
            size="large"
            onClick={scrollToSubcategories}
            variant={ButtonVariant.GREEN}
            style={{ borderRadius: 6 }}
          >
            Смотреть подкатегории
          </Button>
        </VideoBanner>
      )}

      {promoByPlacement.BELOW_HERO && <PromoBlock sections={promoByPlacement.BELOW_HERO} />}

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
      </Container>

      {hasChildren && promoByPlacement.ABOVE_SUBCATEGORIES && (
        <PromoBlock sections={promoByPlacement.ABOVE_SUBCATEGORIES} />
      )}

      {hasChildren && (
        <section id="subcategories" style={{
          padding:'40px 0'
        }}>
          <HorizontalScroller
            items={category?.children || []}
            renderItem={cat => (
              <div style={{ width: '100%', display: 'flex' }}>
                <CategoryCard category={cat} onClick={handleCategoryClick} variant="square" />
              </div>
            )}
            minItemWidth="220px"
            gap="16px"
            paddingInline="40px"
            ariaLabel="Подкатегории"
          />
        </section>
      )}

      {hasChildren && promoByPlacement.BELOW_SUBCATEGORIES && (
        <PromoBlock sections={promoByPlacement.BELOW_SUBCATEGORIES} />
      )}

      <Container>
        {!hasChildren && (
          <>
            {promoByPlacement.ABOVE_FILTERS && (
              <PromoBlock sections={promoByPlacement.ABOVE_FILTERS} />
            )}

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

            {promoByPlacement.BELOW_FILTERS && (
              <PromoBlock sections={promoByPlacement.BELOW_FILTERS} />
            )}

            {promoByPlacement.ABOVE_PRODUCTS && (
              <PromoBlock sections={promoByPlacement.ABOVE_PRODUCTS} />
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Загрузка товаров...</div>
            ) : sortedProducts.length === 0 ? (
              <EmptyState>
                <EmptyIcon>🔍</EmptyIcon>
                <EmptyTitle>Товары не найдены</EmptyTitle>
                <EmptyDescription>В данной категории пока нет товаров</EmptyDescription>
              </EmptyState>
            ) : (
              <>
                <ProductSection title="" products={sortedProducts} variant="primary" />

                {promoByPlacement.BETWEEN_PRODUCTS && (
                  <PromoBlock sections={promoByPlacement.BETWEEN_PRODUCTS} />
                )}
              </>
            )}
            {promoByPlacement.BELOW_PRODUCTS && (
              <PromoBlock sections={promoByPlacement.BELOW_PRODUCTS} />
            )}
          </>
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
