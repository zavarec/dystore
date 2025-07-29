import React from 'react';
import Head from 'next/head';
import { SEOProps } from '@/types/common';
import { generateRobotsContent } from '@/utils/seo';

interface SEOHeadProps extends SEOProps {
  children?: React.ReactNode;
}

// SEO компонент - делает сайт видимым для поисковиков, как лазер Dyson делает пыль видимой
export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonical,
  openGraph,
  structuredData,
  noindex = false,
  nofollow = false,
  children,
}) => {
  const robotsContent = generateRobotsContent(noindex, nofollow);

  return (
    <Head>
      {/* Основные мета-теги */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robotsContent} />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      {openGraph && (
        <>
          <meta property="og:title" content={openGraph.title} />
          <meta property="og:description" content={openGraph.description} />
          <meta property="og:image" content={openGraph.image} />
          <meta property="og:image:alt" content={openGraph.imageAlt} />
          <meta property="og:url" content={openGraph.url} />
          <meta property="og:type" content={openGraph.type || 'website'} />
          <meta property="og:site_name" content={openGraph.siteName || 'DyStore'} />
          <meta property="og:locale" content={openGraph.locale || 'ru_RU'} />
        </>
      )}

      {/* Twitter Cards */}
      {openGraph && (
        <>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={openGraph.title} />
          <meta name="twitter:description" content={openGraph.description} />
          <meta name="twitter:image" content={openGraph.image} />
          <meta name="twitter:image:alt" content={openGraph.imageAlt} />
        </>
      )}

      {/* Структурированные данные JSON-LD */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData, null, 2),
          }}
        />
      )}

      {/* Дополнительные теги */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="format-detection" content="telephone=no" />

      {/* Иконки */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" href="/favicon.ico" />
      {/* Дополнительные теги от родительского компонента */}
      {children}
    </Head>
  );
};
