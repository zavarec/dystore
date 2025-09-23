import { useMemo } from 'react';

import type { GetStaticProps, NextPage } from 'next';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { SEOHead } from '@/components/atoms/seo-head/seo-head';
import type { HeroSpotlightProps } from '@/components/hero-spotlight/hero-spotlight';
import { HeroSpotlight } from '@/components/hero-spotlight/hero-spotlight';
import { Benefits } from '@/components/sections/benefits';
import { Categories } from '@/components/sections/categories';
import { Hero } from '@/components/sections/hero';
import { ProductSection } from '@/components/sections/product-section';
import { Stats } from '@/components/sections/stats';
import { StorePanorama } from '@/components/sections/store-panorama';
import { useProducts } from '@/hooks/useProducts';
import { Container, HeaderWithBenefitsWrapper } from '@/styles/pages/index.style';
import {
  adaptProductsForUI,
  getFeaturedProducts,
  getPopularProducts,
} from '@/utils/product-adapters';

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
    title: 'DysonGroup - Официальный магазин техники Dyson в России',
    description:
      'Купить технику Dyson с официальной гарантией. Пылесосы, фены, очистители воздуха. ✓ Быстрая доставка ✓ 2 года гарантии ✓ Лучшие цены',
    keywords: 'Dyson, пылесосы, фены, очистители воздуха, купить, интернет-магазин',
    canonical: 'https://dyson-group.ru',
    openGraph: {
      title: 'DysonGroup - Официальный магазин техники Dyson',
      description:
        'Купить технику Dyson с официальной гарантией. Пылесосы, фены, очистители воздуха.',
      image: 'https://dyson-group.ru/images/og-home.jpg',
      imageAlt: 'DysonGroup - магазин техники Dyson',
      url: 'https://dyson-group.ru',
      type: 'website',
      siteName: 'DysonGroup',
      locale: 'ru_RU',
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'DysonGroup',
      url: 'https://dyson-group.ru',
      description: 'Официальный магазин техники Dyson в России',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://dyson-group.ru/search?q={search_term_string}',
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

  const promo1: HeroSpotlightProps = {
    title: 'Чистый воздух круглый год',
    subtitle: 'комфорт и свежесть в любое время года.',
    bgImage:
      'https://s3.twcstorage.ru/49dbf9e8-45b07930-284b-4614-95f5-5a9bdcbd9f92/uploads/cd7c4937-07e2-42d6-8fb0-3954381fce1c-15-HP10-Gallery-Image-04.jpg',
    buttonPrimary: {
      label: 'Посмотреть',
      href: '/product/dyson-purifier-hotcool-gen1-hp10-purifying-fan-heater-whitenickel',
    },

    motifImage: {
      src: 'https://s3.twcstorage.ru/49dbf9e8-45b07930-284b-4614-95f5-5a9bdcbd9f92/uploads/652b9d34-b39f-46c2-8bfd-2d7bab1636ca-PH04 Motif.png',
    },
    align: 'right',
  };

  const promo2 = {
    title: 'Многофункциональный стайлер нового поколения',
    subtitle:
      'Лучшие локоны. Более быстрая сушка. Более прямые укладки.² Без повреждений от высокой температуры.',
    bgImage:
      'https://s3.twcstorage.ru/49dbf9e8-45b07930-284b-4614-95f5-5a9bdcbd9f92/uploads/c65b32c1-63fc-43a9-8c28-3e9b83f45959-Web_590-Static-Banner-T3-T4.jpg',
    buttonPrimary: {
      label: 'Посмотреть',
      href: '/product/dyson-airwrap-co-anda2x',
    },

    motifImage: {
      src: 'https://s3.twcstorage.ru/49dbf9e8-45b07930-284b-4614-95f5-5a9bdcbd9f92/uploads/e1aab273-9c11-417d-a2db-ae840b945991-airwrap-co-anda-2x-light.png',
    },
  };

  return (
    <>
      <SEOHead {...seoProps} />

      <HeaderWithBenefitsWrapper>
        <Hero onCatalogClick={handleCatalogClick} />
      </HeaderWithBenefitsWrapper>

      <Categories />

      <StorePanorama />

      <Benefits />

      <HeroSpotlight {...promo1} />

      <HeroSpotlight {...promo2} />
      {/* <HomeSections /> */}

      <Container>
        {error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
            Ошибка загрузки: {error}
          </div>
        ) : (
          <>
            <ProductSection
              title="Рекомендуемые товары"
              products={featuredProducts}
              variant="primary"
              loading={loading}
            />

            {/* <ProductSection
              title="Популярные товары"
              products={popularProducts}
              variant="outline"
              maxItems={3}
              loading={loading}
            /> */}
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
