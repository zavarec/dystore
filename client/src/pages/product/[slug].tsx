import React, { useEffect } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useAppDispatch } from '@/hooks/redux';

import { ProductWithDetails } from '@/types/models/product.model';
import { Product } from '@/types/models/product.model';
import { adaptProductForUI } from '@/utils/product-adapters';
import { ServerProductsService } from '@/services';
import { AddToCartButton } from '@/features/cart/add-to-cart-button';
import { ButtonVariant } from '@/components/atoms/button/button.style';
import {
  ProductPageContainer,
  ProductImageSection,
  ProductMainImage,
  ProductInfoSection,
  ProductBreadcrumbs,
  BreadcrumbLink,
  ProductTitle,
  ProductDescription,
  ProductPrice,
  CurrentPrice,
  ProductActions,
  InStockBadge,
  OutOfStockBadge,
} from '@/styles/pages/product-slug.style';
import { fetchCart } from '@/store/slices/cart-slice/cart.thunks';
import { AddToCartButtonVariant } from '@/features/cart/add-to-cart-button/add-to-cart-button';
import { formatPriceRub } from '@/utils/format';

interface ProductPageProps {
  product: ProductWithDetails;
}

// // Утилиты для работы с продуктом
// const generateProductSlug = (product: ProductWithDetails): string => {
//   return (
//     product.slug ||
//     product.name
//       .toLowerCase()
//       .replace(/\s+/g, '-')
//       .replace(/[^\w\-]/g, '')
//   );
// };

const getProductImage = (product: ProductWithDetails): string => {
  return product.images?.[0]?.url || '/images/placeholder.webp';
};

const getCategorySlug = (category: any): string => {
  if (typeof category === 'object' && category?.name) {
    return category.name.toLowerCase().replace(/\s+/g, '-');
  }
  return 'products';
};

const ProductPage: NextPage<ProductPageProps> = ({ product }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Загружаем корзину при монтировании
    dispatch(fetchCart());
  }, [dispatch]);

  if (!product) {
    return (
      <ProductPageContainer>
        <div style={{ textAlign: 'center', padding: '40px' }}>Продукт не найден</div>
      </ProductPageContainer>
    );
  }

  const imageUrl = getProductImage(product);
  const categorySlug = getCategorySlug(product.category);
  const isInStock = product.stock > 0;
  const brand = 'Dyson'; // Все продукты Dyson согласно seed данным

  const canonical = `https://dyson-group.ru/product/${encodeURIComponent(product.slug ?? product.id)}`;

  // SEO данные
  const seoData = {
    title: `${product.name} - Купить в DysonGroup с доставкой | Официальная гарантия`,
    description: `${product.shortDescription || product.description || product.name}. Цена ${product.price.toLocaleString()} ₽. ✓ Официальная гарантия 2 года ✓ Быстрая доставка ✓ Качественное обслуживание`,
    // canonical: `https://dyson-group.ru/product/${product.id}`,
    canonical: canonical,
    keywords: `${product.name}, ${brand}, купить, интернет-магазин, Dyson`,
  };

  // Структурированные данные Product для SEO
  const productStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': seoData.canonical,
    name: product.name,
    description: product.description || product.shortDescription || product.name,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    sku: `DYSON-${product.slug}`,
    image: [imageUrl.startsWith('http') ? imageUrl : `https://dyson-group.ru${imageUrl}`],
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'RUB',
      availability: isInStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'DysonGroup',
        url: 'https://dyson-group.ru',
      },
      url: seoData.canonical,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 дней
    },
  };

  // Хлебные крошки для SEO
  const breadcrumbsData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: 'https://dyson-group.ru',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: getCategoryName(product.category),
        item: `https://dyson-group.ru/category/${categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: seoData.canonical,
      },
    ],
  };
  console.log(product, 'PRODUCT in product page');

  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <link rel="canonical" href={seoData.canonical} />

        {/* Open Graph */}
        <meta property="og:title" content={product.name} />
        <meta
          property="og:description"
          content={product.shortDescription || product.description || product.name}
        />
        <meta
          property="og:image"
          content={imageUrl.startsWith('http') ? imageUrl : `https://dyson-group.ru${imageUrl}`}
        />
        <meta property="og:image:alt" content={product.name} />
        <meta property="og:url" content={seoData.canonical} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="DysonGroup" />
        <meta property="og:locale" content="ru_RU" />
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="RUB" />
        <meta property="product:availability" content={isInStock ? 'in stock' : 'out of stock'} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.name} />
        <meta
          name="twitter:description"
          content={product.shortDescription || product.description || product.name}
        />
        <meta
          name="twitter:image"
          content={imageUrl.startsWith('http') ? imageUrl : `https://dyson-group.ru${imageUrl}`}
        />

        {/* Структурированные данные */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbsData),
          }}
        />
      </Head>

      <ProductPageContainer>
        <ProductBreadcrumbs>
          <BreadcrumbLink href="/">Главная</BreadcrumbLink>
          <span> / </span>
          <BreadcrumbLink href={`/category/${product.category?.slug}`}>
            {getCategoryName(product.category)}
          </BreadcrumbLink>
          <span> / </span>
          {/* <span>{product.name}</span> */}
        </ProductBreadcrumbs>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            alignItems: 'start',
          }}
        >
          <ProductImageSection>
            <ProductMainImage>
              <Image
                src={product.imageUrl || ''}
                alt={product.name}
                width={600}
                height={600}
                priority
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjAwJyBoZWlnaHQ9JzYwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nNjAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nI2U5ZWNlZicvPjwvc3ZnPg=="
              />
            </ProductMainImage>
          </ProductImageSection>

          <ProductInfoSection>
            <ProductTitle>{product.name}</ProductTitle>

            {product.shortDescription && (
              <ProductDescription>{product.shortDescription}</ProductDescription>
            )}

            {product.description && product.description !== product.shortDescription && (
              <ProductDescription style={{ marginTop: '16px', opacity: 0.8 }}>
                {product.description}
              </ProductDescription>
            )}

            <ProductPrice>
              <CurrentPrice>{formatPriceRub(product.price)}</CurrentPrice>
            </ProductPrice>

            {isInStock ? (
              <InStockBadge>✓ В наличии ({product.stock} шт.)</InStockBadge>
            ) : (
              <OutOfStockBadge>⚠ Нет в наличии</OutOfStockBadge>
            )}

            <ProductActions>
              <AddToCartButton
                productId={product.id}
                product={product}
                variant={ButtonVariant.PRIMARY}
                size={AddToCartButtonVariant.LARGE}
                showQuantity={true}
              />
            </ProductActions>
          </ProductInfoSection>
        </div>
      </ProductPageContainer>
    </>
  );
};

// Утилита для получения названия категории
function getCategoryName(category: any): string {
  if (typeof category === 'object' && category?.name) {
    return category.name;
  }

  const categoryNames: Record<string, string> = {
    пылесосы: 'Пылесосы',
    фены: 'Фены',
    укладчики: 'Укладчики',
    'очистители воздуха': 'Очистители воздуха',
  };

  if (typeof category === 'string') {
    return categoryNames[category.toLowerCase()] || category;
  }

  return 'Товары';
}

// export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
//   try {
//     const products = await ServerProductsService.getAllProducts();
//     const ids = Array.isArray(products) ? products.map(p => String(p.id)) : [];
//     const paths = ids.flatMap(slug =>
//       (locales || ['ru']).map(locale => ({ params: { slug }, locale })),
//     );
//     return { paths, fallback: 'blocking' };
//   } catch {
//     return { paths: [], fallback: 'blocking' };
//   }
// };

// export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
//   try {
//     const productId = params?.slug as string;
//     const productRaw: Product = await ServerProductsService.getProductById(Number(productId));
//     if (!productRaw?.id) {
//       return { notFound: true, revalidate: 60 };
//     }

//     const product = adaptProductForUI(productRaw);

//     return {
//       props: {
//         ...(await serverSideTranslations(locale ?? 'ru', ['common'])),
//         product,
//       },
//       revalidate: 3600,
//     };
//   } catch {
//     return { notFound: true, revalidate: 60 };
//   }
// };

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  try {
    const products = await ServerProductsService.getAllProducts();
    const slugs = (products || []).map(p => p.slug).filter(Boolean);
    console.log(slugs, 'SLUGS in product page');

    const paths = slugs.flatMap(slug =>
      (locales || ['ru']).map(locale => ({ params: { slug }, locale })),
    );

    return { paths, fallback: 'blocking' };
  } catch {
    return { paths: [], fallback: 'blocking' };
  }
};

// ✅ Забираем продукт по SLUG (а не по id)
export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  try {
    const slug = String(params?.slug || '');
    // Диагностика SSR запроса
    try {
      // 1) Определяем id по slug
      const bySlug: Product = await ServerProductsService.getProductBySlug(slug);
      console.log('[product/[slug]] fetched by slug:', slug, '=> id:', bySlug?.id);

      if (!bySlug?.id) {
        return { notFound: true, revalidate: 60 };
      }

      // 2) Грузим товар по id (как просили)
      const productById: Product = await ServerProductsService.getProductById(Number(bySlug.id));
      const product = adaptProductForUI(productById || bySlug);

      return {
        props: {
          ...(await serverSideTranslations(locale ?? 'ru', ['common'])),
          product,
        },
        revalidate: 3600,
      };
    } catch (err: any) {
      console.error(
        '[product/[slug]] fetch error for slug',
        slug,
        err?.response?.status,
        err?.response?.data || err?.message,
      );
      throw err;
    }
  } catch (e) {
    console.error(
      '[product/[slug]] getStaticProps failed, returning notFound. Slug:',
      params?.slug,
      'Error:',
      (e as any)?.message,
    );
    return { notFound: true, revalidate: 60 };
  }
};

export default ProductPage;
