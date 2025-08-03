import { ProductWithDetails, ProductStructuredData } from '@/types/models/product.model';
import { SEOProps } from '@/types/common';

// Генерация структурированных данных для продуктов - потому что Google любит порядок
export const generateProductStructuredData = (
  product: ProductWithDetails,
  baseUrl: string,
): ProductStructuredData => {
  const structuredData: ProductStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.shortDescription || '',
    image: product.images?.filter(img => img.isPrimary).map(img => `${baseUrl}${img.url}`) || [
      product.imageUrl || '',
    ],
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Dyson',
    },
    offers: {
      '@type': 'Offer',
      price: product.price.toString(),
      priceCurrency: product.currency || 'RUB',
      availability:
        product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/product/${product.slug || product.id}`,
    },
    sku: product.sku || product.id.toString(),
    mpn: product.model || product.name,
  };

  if (product.reviewCount && product.reviewCount > 0 && product.rating) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
    };
  }

  return structuredData;
};

// Генерация хлебных крошек
export const generateBreadcrumbStructuredData = (
  breadcrumbs: Array<{ name: string; url: string }>,
  baseUrl: string,
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${baseUrl}${crumb.url}`,
    })),
  };
};

// Генерация SEO мета-тегов для продукта
export const generateProductSEO = (product: ProductWithDetails, baseUrl: string): SEOProps => {
  const primaryImage = product.images?.find(img => img.isPrimary);
  const imageUrl = primaryImage ? `${baseUrl}${primaryImage.url}` : product.imageUrl || '';

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.description || product.shortDescription || '',
    keywords: [
      product.brand || 'Dyson',
      product.category?.name || '',
      ...(product.tags || []),
      ...(product.features || []).slice(0, 3),
    ]
      .filter(Boolean)
      .join(', '),
    canonical: `${baseUrl}/product/${product.slug || product.id}`,
    openGraph: {
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.description || product.shortDescription || '',
      image: imageUrl,
      imageAlt: primaryImage?.alt || product.name,
      url: `${baseUrl}/product/${product.slug || product.id}`,
      type: 'product',
      siteName: 'DyStore',
      locale: 'ru_RU',
    },
    structuredData: generateProductStructuredData(product, baseUrl),
  };
};

// Генерация SEO для категорий
export const generateCategorySEO = (
  categoryName: string,
  categorySlug: string,
  description: string,
  baseUrl: string,
  productsCount: number,
): SEOProps => {
  return {
    title: `${categoryName} Dyson - Купить в интернет-магазине DyStore`,
    description: `${description} Большой выбор ${categoryName.toLowerCase()} Dyson. ${productsCount} товаров в наличии. ✓ Гарантия ✓ Быстрая доставка`,
    keywords: `${categoryName}, Dyson, купить, интернет-магазин, ${categorySlug}`,
    canonical: `${baseUrl}/category/${categorySlug}`,
    openGraph: {
      title: `${categoryName} Dyson - DyStore`,
      description: `Купить ${categoryName.toLowerCase()} Dyson с гарантией. ${productsCount} товаров в наличии.`,
      image: `${baseUrl}/images/categories/${categorySlug}-og.jpg`,
      imageAlt: `${categoryName} Dyson`,
      url: `${baseUrl}/category/${categorySlug}`,
      type: 'website',
      siteName: 'DyStore',
      locale: 'ru_RU',
    },
  };
};

// Генерация robots meta
export const generateRobotsContent = (noindex = false, nofollow = false): string => {
  const directives = [];

  if (noindex) directives.push('noindex');
  if (nofollow) directives.push('nofollow');

  if (directives.length === 0) {
    return 'index,follow';
  }

  return directives.join(',');
};

// Форматирование цены для микроразметки
export const formatPriceForSchema = (price: number): string => {
  return `${price}`;
};

// Генерация URL для изображений
export const getOptimizedImageUrl = (
  url: string,
  width?: number,
  height?: number,
  quality = 80,
): string => {
  const params = new URLSearchParams();

  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('q', quality.toString());

  return `${url}?${params.toString()}`;
};
