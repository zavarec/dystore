import { useEffect } from 'react';

import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import Head from 'next/head';
import Image from 'next/image';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { ButtonVariant } from '@/components/atoms/button/button.style';
import { ProductMotif } from '@/components/product-motif/product-motif';
import { Benefits } from '@/components/sections/benefits';
import { Accessuares } from '@/features/accessuares/accessuares';
import { AddToCartButton } from '@/features/cart/add-to-cart-button';
import { AddToCartButtonVariant } from '@/features/cart/add-to-cart-button/add-to-cart-button';
import { ProductKeyFeatures } from '@/features/key-features/product-key-features';
import { ProductDescription as ProductDescriptionBlock } from '@/features/product-description/product-description';
import { PromoSlotRenderer } from '@/features/promo-block/promo-slot-renderer';
import { Specifications } from '@/features/specifications/specifications';
import { useAppDispatch } from '@/hooks/redux';
import { fetchCart } from '@/store/slices/cart-slice/cart.thunks';
import {
  ProductPageContainer,
  ProductImageSection,
  ProductMainImage,
  ProductInfoSection,
  ProductBreadcrumbs,
  BreadcrumbLink,
  ProductTitle,
  ProductDescription as ProductDescriptionText,
  ProductPrice,
  CurrentPrice,
  ProductActions,
  ProductInfoWithImageWrapperStyled,
  ProductMotifDesktopWrapper,
  ProductMotifMobileWrapper,
} from '@/styles/pages/product-slug.style';
import type { Category } from '@/types/models/category.model';
import type { ProductWithDetails } from '@/types/models/product.model';
import type { PromoPlacement } from '@/types/models/promo-placement.model';
import { PromoSlot } from '@/types/models/promo-section.model';
import { formatPriceRub } from '@/utils/format';
import { adaptProductForUI } from '@/utils/product-adapters';

interface ProductPageProps {
  product: ProductWithDetails;
  placements?: PromoPlacement[]; // список PromoPlacement с включенной promoSection
}

const getProductImage = (product: ProductWithDetails): string => {
  console.log(product, 'PRODUCT in getProductImage');

  return product.images?.[0]?.url || '/images/placeholder.webp';
};

const getCategorySlug = (category?: Category): string => {
  if (typeof category === 'object' && category?.name) {
    return category.name.toLowerCase().replace(/\s+/g, '-');
  }
  return 'products';
};

const ProductPage: NextPage<ProductPageProps> = ({ product, placements }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
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
  const motifSrc = product.motif?.url ?? product.motifUrl ?? null;

  const motifAlt = product.motif?.storedName ?? `${product.name} motif`;

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
        name: getCategoryName(product.category ?? ''),
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

  console.log(placements, 'PLACEMENTS in product page');

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

      {/* Промо: над всей страницей товара */}
      <PromoSlotRenderer placements={placements ?? []} slot={PromoSlot.ABOVE_HERO} />

      <ProductPageContainer>
        <ProductBreadcrumbs>
          <BreadcrumbLink href="/">Главная</BreadcrumbLink>
          <span> / </span>
          <BreadcrumbLink href={`/category/${product.category?.slug}`}>
            {getCategoryName(product.category ?? '')}
          </BreadcrumbLink>
          <span> / </span>
          {/* <span>{product.name}</span> */}
        </ProductBreadcrumbs>

        <ProductInfoWithImageWrapperStyled>
          <ProductImageSection>
            {motifSrc && (
              <ProductMotifMobileWrapper>
                <ProductMotif src={motifSrc} alt={motifAlt} />
              </ProductMotifMobileWrapper>
            )}
            <ProductMainImage>
              <Image
                src={product.mainImage?.url || ''}
                alt={product.mainImage?.storedName || product.name}
                width={600}
                height={600}
                priority
                style={{
                  objectFit: 'contain',
                  height: '100%',
                }}
                sizes="(max-width: 768px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjAwJyBoZWlnaHQ9JzYwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nNjAwJyBoZWlnaHQ9JzYwMCcgZmlsbD0nI2U5ZWNlZicvPjwvc3ZnPg=="
              />
            </ProductMainImage>
          </ProductImageSection>

          <ProductInfoSection>
            {motifSrc && (
              <ProductMotifDesktopWrapper>
                <ProductMotif src={motifSrc} alt={motifAlt} />
              </ProductMotifDesktopWrapper>
            )}
            <ProductTitle>{product.name}</ProductTitle>

            {product.shortDescription && (
              <ProductDescriptionText>{product.shortDescription}</ProductDescriptionText>
            )}

            {product.keyFeatures && <ProductKeyFeatures features={product.keyFeatures} />}

            <ProductPrice>
              <CurrentPrice>{formatPriceRub(product.price)}</CurrentPrice>
            </ProductPrice>

            <ProductActions>
              <AddToCartButton
                productId={product.id}
                product={product}
                variant={ButtonVariant.GREEN}
                size={AddToCartButtonVariant.LARGE}
                showQuantity={true}
              />
            </ProductActions>
          </ProductInfoSection>
        </ProductInfoWithImageWrapperStyled>
      </ProductPageContainer>

      {product.description && (
        <ProductDescriptionBlock title="Подробное описание" description={product.description} />
      )}

      <Specifications
        specs={product.specs ?? []}
        dimensionsImageUrl={product.dimensionsImageUrl ?? null}
        title="Характеристики"
      />

      <Benefits />

      <PromoSlotRenderer placements={placements ?? []} slot={PromoSlot.BELOW_PRODUCTS} />

      <Accessuares
        productName={product.name}
        boxItems={product.boxItems ?? []}
        productImageUrl={product.mainImage?.url}
      />

      <PromoSlotRenderer placements={placements ?? []} slot={PromoSlot.PDP_BELOW_ACCESSORY} />
    </>
  );
};

// Утилита для получения названия категории
function getCategoryName(category: Category | string): string {
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

export const getStaticPaths: GetStaticPaths = async () => {
  // На билде не ходим в API: пусто + fallback
  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = String(params?.slug || '');
  const apiBase = process.env.API_URL_SERVER || 'http://api:3001/api'; // <— ключевое

  try {
    // 1) по slug
    const r1 = await fetch(`${apiBase}/products/slug/${encodeURIComponent(slug)}`);
    if (!r1.ok) return { notFound: true, revalidate: 60 };
    const bySlug = await r1.json();

    // 2) по id (если нужно)
    let productRaw = bySlug;
    try {
      const r2 = await fetch(`${apiBase}/products/id/${encodeURIComponent(bySlug.id)}`);
      if (r2.ok) productRaw = await r2.json();
    } catch (error: unknown) {
      console.error(error);
    }

    const entitySlug = (bySlug.slug ?? slug) as string;
    const entityId = String(bySlug.id ?? '');

    let placements: PromoPlacement[] = [];

    const placementsBySlugRes = await fetch(
      `${apiBase}/promo?pageType=PRODUCT&entityId=${encodeURIComponent(entitySlug)}`,
    );
    if (placementsBySlugRes.ok) {
      placements = await placementsBySlugRes.json();
    }

    if ((!placements || placements.length === 0) && entityId) {
      const placementsByIdRes = await fetch(
        `${apiBase}/promo?pageType=PRODUCT&entityId=${encodeURIComponent(entityId)}`,
      );
      if (placementsByIdRes.ok) {
        placements = await placementsByIdRes.json();
      }
    }

    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'ru', ['common'])),
        product: adaptProductForUI(productRaw),
        placements,
      },
      revalidate: 3600,
    };
  } catch {
    return { notFound: true, revalidate: 60 };
  }
};

export default ProductPage;
