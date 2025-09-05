export type SeoPageType = 'CATEGORY' | 'PRODUCT' | 'LANDING' | 'STATIC';

export interface SeoMeta {
  id: number;
  pageType: SeoPageType;
  entityId: string;
  locale: string;

  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  canonical?: string | null;
  robots?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  twitterCard?: string | null;
  structuredData?: Record<string, unknown> | null;
  hreflang?: Record<string, unknown> | null;

  createdAt: string;
  updatedAt: string;
}

export interface UpsertSeoMetaRequest {
  pageType: SeoPageType;
  entityId: string;
  locale?: string;
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  structuredData?: Record<string, unknown>;
  hreflang?: Record<string, unknown>;
}



