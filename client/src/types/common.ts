// Общие типы - фундамент как у пылесосов Dyson
export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  openGraph?: OpenGraphProps;
  structuredData?: Record<string, unknown>;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface OpenGraphProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  url: string;
  type?: string;
  siteName?: string;
  locale?: string;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export type Locale = 'en' | 'ru';

export interface LocalizedContent {
  en: string;
  ru: string;
}

// Для форм и валидации
export interface FormField {
  name: string;
  value: string;
  error?: string;
  required?: boolean;
}

// Для уведомлений
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Для аналитики и метрик
export interface AnalyticsEvent {
  name: string;
  parameters: Record<string, string | number | boolean>;
  timestamp: number;
}

// Responsive breakpoints
export const BREAKPOINTS = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  largeDesktop: '(min-width: 1440px)',
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;
