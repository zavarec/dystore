import React, { useEffect, useMemo } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useAppDispatch } from '@/hooks/redux';

import { ProductWithDetails } from '@/types/models/product.model';
import { useProducts } from '@/hooks/useProducts';
import { adaptProductsForUI } from '@/utils/product-adapters';
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

interface ProductPageProps {
  productId: string;
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

const ProductPage: NextPage<ProductPageProps> = ({ productId }) => {
  const dispatch = useAppDispatch();
  const { products, loading } = useProducts();

  const product = useMemo(() => {
    if (!products.length) return null;
    const adaptedProducts = adaptProductsForUI(products);
    return adaptedProducts.find(p => p.id.toString() === productId) || null;
  }, [products, productId]);

  useEffect(() => {
    // Загружаем корзину из localStorage при монтировании
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading) {
    return (
      <ProductPageContainer>
        <div style={{ textAlign: 'center', padding: '40px' }}>Загрузка продукта...</div>
      </ProductPageContainer>
    );
  }

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

  // SEO данные
  const seoData = {
    title: `${product.name} - Купить в DyStore с доставкой | Официальная гарантия`,
    description: `${product.shortDescription || product.description || product.name}. Цена ${product.price.toLocaleString()} ₽. ✓ Официальная гарантия 2 года ✓ Быстрая доставка ✓ Качественное обслуживание`,
    canonical: `https://dystore.ru/product/${product.id}`,
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
    sku: `DYSON-${product.id}`,
    image: [imageUrl.startsWith('http') ? imageUrl : `https://dystore.ru${imageUrl}`],
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'RUB',
      availability: isInStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'DyStore',
        url: 'https://dystore.ru',
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
        item: 'https://dystore.ru',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: getCategoryName(product.category),
        item: `https://dystore.ru/category/${categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: seoData.canonical,
      },
    ],
  };

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
          content={imageUrl.startsWith('http') ? imageUrl : `https://dystore.ru${imageUrl}`}
        />
        <meta property="og:image:alt" content={product.name} />
        <meta property="og:url" content={seoData.canonical} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="DyStore" />
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
          content={imageUrl.startsWith('http') ? imageUrl : `https://dystore.ru${imageUrl}`}
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
          <span>{product.name}</span>
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
              <CurrentPrice>{product.price.toLocaleString()} ₽</CurrentPrice>
            </ProductPrice>

            {isInStock ? (
              <InStockBadge>✓ В наличии ({product.stock} шт.)</InStockBadge>
            ) : (
              <OutOfStockBadge>⚠ Нет в наличии</OutOfStockBadge>
            )}

            <ProductActions>
              <AddToCartButton
                // productId={product.id}
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

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const productId = params?.slug as string;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ru', ['common'])),
      productId,
    },
  };
};

export default ProductPage;
