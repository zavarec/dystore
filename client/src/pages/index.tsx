import React, { useMemo } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { useProducts } from '@/hooks/useProducts';
import {
  adaptProductsForUI,
  getFeaturedProducts,
  getPopularProducts,
} from '@/utils/product-adapters';
import { Container, HeaderWithBenefitsWrapper } from '@/styles/pages/index.style';
import { Stats } from '@/components/sections/stats';
import { ProductSection } from '@/components/sections/product-section';
import { Hero } from '@/components/sections/hero';
import { Benefits } from '@/components/sections/benefits';
import { Categories } from '@/components/sections/categories';
import { StorePanorama } from '@/components/sections/store-panorama';
import { SEOHead } from '@/components/atoms/seo-head/seo-head';

const HomePage: NextPage = () => {
  const { products, loading, error } = useProducts();

  // Адаптируем продукты для UI и создаем производные списки
  const adaptedProducts = useMemo(() => {
    return adaptProductsForUI(products);
  }, [products]);

  const featuredProducts = useMemo(() => {
    return getFeaturedProducts(adaptedProducts);
  }, [adaptedProducts]);

  const popularProducts = useMemo(() => {
    return getPopularProducts(adaptedProducts);
  }, [adaptedProducts]);

  const seoProps = {
    title: 'DyStore - Официальный магазин техники Dyson в России',
    description:
      'Купить технику Dyson с официальной гарантией. Пылесосы, фены, очистители воздуха. ✓ Быстрая доставка ✓ 2 года гарантии ✓ Лучшие цены',
    keywords: 'Dyson, пылесосы, фены, очистители воздуха, купить, интернет-магазин',
    canonical: 'https://dystore.ru',
    openGraph: {
      title: 'DyStore - Официальный магазин техники Dyson',
      description:
        'Купить технику Dyson с официальной гарантией. Пылесосы, фены, очистители воздуха.',
      image: 'https://dystore.ru/images/og-home.jpg',
      imageAlt: 'DyStore - магазин техники Dyson',
      url: 'https://dystore.ru',
      type: 'website',
      siteName: 'DyStore',
      locale: 'ru_RU',
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'DyStore',
      url: 'https://dystore.ru',
      description: 'Официальный магазин техники Dyson в России',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://dystore.ru/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  };

  const statsData = [
    { number: '10+', label: 'Лет на рынке' },
    { number: '50k+', label: 'Довольных клиентов' },
    { number: '24/7', label: 'Поддержка клиентов' },
    { number: '2', label: 'Года гарантии' },
  ];

  const handleCatalogClick = () => {
    window.scrollTo({ top: 600, behavior: 'smooth' });
  };

  return (
    <>
      <SEOHead {...seoProps} />

      <HeaderWithBenefitsWrapper>
        <Hero onCatalogClick={handleCatalogClick} />
        <Benefits />
      </HeaderWithBenefitsWrapper>

      <Categories />

      <StorePanorama />

      <Container>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Загрузка товаров...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
            Ошибка загрузки: {error}
          </div>
        ) : (
          <>
            <ProductSection
              title="Рекомендуемые товары"
              products={featuredProducts}
              variant="primary"
            />

            <ProductSection
              title="Популярные товары"
              products={popularProducts}
              variant="outline"
              maxItems={3}
            />
          </>
        )}
      </Container>

      <Stats stats={statsData} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ru', ['common'])),
    },
    revalidate: 3600, // Обновляем каждый час
  };
};

export default HomePage;
