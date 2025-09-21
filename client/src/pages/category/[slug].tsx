import React, { useState, useMemo } from 'react';
import { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
// import { useRouter } from 'next/router';
import { SEOHead } from '@/components/atoms/seo-head/seo-head';
import { ProductSortBy } from '@/types/models/product.model';
import { useCategoryBySlug } from '@/hooks';
import { useCategoryProductsDeep } from '@/hooks/use-category-products-deep';
import { adaptProductsForUI } from '@/utils/product-adapters';
import { ProductSection } from '@/components/sections/product-section';

import { VideoBanner } from '@/components/atoms/video-banner';

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

// import { HorizontalScroller } from '@/components/atoms/horizontal-scroller/horizontal-scroller';
// import { CategoryCard } from '@/components/sections/categories/components';

import { categoryVideoMap } from '@/constants/category-video-map';
import { buildSEOFromMeta, fetchSeoMetaSSR } from '@/utils/seo';
// import { allCategoriesPreviewImage } from '@/constants/category.constnat';

import { SeoMeta } from '@/types/models/seo-meta.model';

import { PromoSlot } from '@/types/models/promo-section.model';
import { groupBySlot } from '@/utils/page-promo';
import { PromoPlacement } from '@/types/models/promo-placement.model';
import { PromoSlotRenderer } from '@/features/promo-block/promo-slot-renderer';

interface CategoryPageProps {
  slug: string;
  seoMeta: SeoMeta | null;
  locale: string;
  placements?: PromoPlacement[];
}

const CategoryPage: NextPage<CategoryPageProps> = ({ slug, seoMeta, locale, placements }) => {
  // const router = useRouter();
  const [sortBy, setSortBy] = useState<ProductSortBy>(ProductSortBy.POPULARITY);

  const { category, loading: categoryLoading } = useCategoryBySlug(slug);

  // Используем новый хук для получения продуктов с подкатегориями
  const {
    products: fetchedProducts,
    loading: productsLoading,
    total: totalProducts,
  } = useCategoryProductsDeep({
    slug: slug, // Используем slug из параметров URL
    deep: true, // Включаем продукты из подкатегорий
    page: 1,
    limit: 100, // Увеличиваем лимит для отображения всех продуктов
    sort: sortBy,
  });

  // Адаптируем продукты для UI
  const rawProducts = useMemo(() => {
    console.log('Raw fetched products:', fetchedProducts);
    const adapted = adaptProductsForUI(fetchedProducts ?? []);
    console.log('Adapted products:', adapted);
    return adapted;
  }, [fetchedProducts]);

  // // Адаптируем продукты для UI
  // const categoryProducts = useMemo(() => {
  //   return adaptProductsForUI(rawCategoryProducts);
  // }, [rawCategoryProducts]);

  // Сортировка продуктов
  const sortedProducts = useMemo(() => {
    const sorted = [...rawProducts];

    switch (sortBy) {
      case ProductSortBy.PRICE_LOW_TO_HIGH:
        return sorted.sort((a, b) => a.price - b.price);
      case ProductSortBy.PRICE_HIGH_TO_LOW:
        return sorted.sort((a, b) => b.price - a.price);
      case ProductSortBy.POPULARITY:
      default:
        return sorted;
      // case ProductSortBy.RATING:
      //   return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      // case ProductSortBy.NEWEST:
      //   return sorted.sort(
      //     (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime(),
      //   );
      // case ProductSortBy.NAME:
      //   return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [rawProducts, sortBy]);

  const loading = categoryLoading || productsLoading;
  const categoryName = category?.name || 'Категория';
  const categoryDescription = `Товары категории ${categoryName}${totalProducts > 0 ? ` (${totalProducts} товаров)` : ''}`;
  const categoryVideoSrc = categoryVideoMap[slug];

  // const subcategoryItems = useMemo(() => {
  //   const children = category?.children || [];
  //   if (!category) return children;

  //   const viewAll = {
  //     id: -1,
  //     name: 'Смотреть всё',
  //     slug,
  //     image:
  //       (allCategoriesPreviewImage as Record<string, string>)[slug] ||
  //       category.imageUrl ||
  //       '/images/placeholder.webp',
  //   };

  //   return [...children, viewAll];
  // }, [category, slug]);

  // const handleCategoryClick = useCallback(
  //   (subcategorySlug: string) => {
  //     router.push(`/category/${subcategorySlug}`);
  //   },
  //   [router],
  // );

  // const scrollToSubcategories = useCallback(() => {
  //   const el = document.getElementById('subcategories');
  //   if (el) {
  //     el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //   }
  // }, []);

  const bySlot = useMemo(() => groupBySlot(placements ?? []), [placements]);

  const fallBackSEO = useMemo(
    () => ({
      title: `${categoryName} - DysonGroup`,
      description: `${categoryDescription}. Официальная гарантия, быстрая доставка.`,
      canonical: `https://dyson-group.ru/category/${slug}`,
      openGraph: {
        title: `${categoryName} - DysonGroup`,
        description: `${categoryDescription}.`,
        image: '',
        url: `https://dyson-group.ru/category/${slug}`,
        type: 'website',
        siteName: 'DysonGroup',
        locale: locale ?? 'ru_RU',
        imageAlt: `${categoryName} - DysonGroup`,
      },
    }),
    [slug, locale],
  ); // и

  // SEO данные
  const seoData = buildSEOFromMeta(fallBackSEO, seoMeta);

  return (
    <>
      <SEOHead {...seoData} />

      {bySlot.ABOVE_HERO && (
        <PromoSlotRenderer placements={placements ?? []} slot={PromoSlot.ABOVE_HERO} />
      )}

      {/* {hasChildren && ( */}
      <VideoBanner
        height="60vh"
        {...(categoryVideoSrc ? { src: categoryVideoSrc } : {})}
        {...(!categoryVideoSrc && category?.imageUrl ? { backgroundImage: category.imageUrl } : {})}
      >
        <h1 style={{ fontSize: '2.2rem', marginBottom: 12 }}>{categoryName}</h1>
        <p style={{ opacity: 0.9, marginBottom: 16 }}>{categoryDescription}</p>
        {/* <Button
            size="large"
            onClick={scrollToSubcategories}
            variant={ButtonVariant.GREEN}
            style={{ borderRadius: 6 }}
          >
            Перейти к разделам
          </Button> */}
      </VideoBanner>
      {/* )} */}

      {bySlot.BELOW_HERO && (
        <PromoSlotRenderer placements={placements ?? []} slot={PromoSlot.BELOW_HERO} />
      )}

      <Container>
        <Header>
          <div>
            <nav>
              <Link href="/" style={{ color: '#666', textDecoration: 'none' }}>
                Главная
              </Link>
              <span style={{ margin: '0 8px', color: '#666' }}>/</span>
              <span style={{ color: '#333' }}>{categoryName}</span>
            </nav>

            <CategoryTitle>{categoryName}</CategoryTitle>
            <CategoryDescription>{category?.description}</CategoryDescription>
          </div>
        </Header>
      </Container>

      {/* {hasChildren && bySlot.ABOVE_SUBCATEGORIES && (
        <PromoSlotRenderer placements={placements ?? []} slot={PromoSlot.ABOVE_SUBCATEGORIES} />
      )}

      {hasChildren && (
        <section id="subcategories">
          <HorizontalScroller
            items={subcategoryItems}
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

      {hasChildren && bySlot.BELOW_SUBCATEGORIES && (
        <PromoSlotRenderer placements={placements ?? []} slot={PromoSlot.BELOW_SUBCATEGORIES} />
      )} */}

      <Container>
        {
          <>
            {bySlot.ABOVE_FILTERS && (
              <PromoSlotRenderer placements={placements ?? []} slot={PromoSlot.ABOVE_FILTERS} />
            )}

            <FiltersBar>
              <FilterGroup>
                <FilterLabel>Товаров найдено:</FilterLabel>

                <ProductsCount>
                  {loading ? '...' : totalProducts || sortedProducts?.length}
                </ProductsCount>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Сортировка:</FilterLabel>

                <Select value={sortBy} onChange={e => setSortBy(e.target.value as ProductSortBy)}>
                  {/* <option value={ProductSortBy.POPULARITY}>По популярности</option> */}
                  <option value={ProductSortBy.PRICE_LOW_TO_HIGH}>По цене: по возрастанию</option>
                  <option value={ProductSortBy.PRICE_HIGH_TO_LOW}>По цене: по убыванию</option>
                  {/* <option value={ProductSortBy.RATING}>По рейтингу</option>
                  <option value={ProductSortBy.NEWEST}>Новинки</option>
                  <option value={ProductSortBy.NAME}>По названию</option> */}
                </Select>
              </FilterGroup>
            </FiltersBar>

            {bySlot.BELOW_FILTERS && (
              <PromoSlotRenderer placements={placements ?? []} slot={PromoSlot.BELOW_FILTERS} />
            )}

            {bySlot.ABOVE_PRODUCTS && (
              <PromoSlotRenderer placements={placements ?? []} slot={PromoSlot.ABOVE_PRODUCTS} />
            )}

            {loading ? (
              <ProductSection title="" products={[]} variant="primary" loading={true} />
            ) : sortedProducts?.length === 0 ? (
              <EmptyState>
                <EmptyIcon>🔍</EmptyIcon>
                <EmptyTitle>Товары не найдены</EmptyTitle>
                <EmptyDescription>В данной категории пока нет товаров</EmptyDescription>
              </EmptyState>
            ) : (
              <>
                <ProductSection title="" products={sortedProducts || []} variant="primary" />

                {bySlot.BETWEEN_PRODUCTS && (
                  <PromoSlotRenderer
                    placements={placements ?? []}
                    slot={PromoSlot.BETWEEN_PRODUCTS}
                  />
                )}
              </>
            )}
            {bySlot.BELOW_PRODUCTS && (
              <PromoSlotRenderer placements={placements ?? []} slot={PromoSlot.BELOW_PRODUCTS} />
            )}
          </>
        }
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

  const seoMeta: SeoMeta | null = await fetchSeoMetaSSR('CATEGORY', slug, locale ?? 'ru');

  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ru', ['common'])),
      slug,
      seoMeta,
      locale,
    },
    revalidate: 3600, // Перегенерация каждый час
  };
};

export default CategoryPage;
