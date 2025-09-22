export type PromoMedia =
  | { type: 'image'; src: string }
  | { type: 'video'; src: string; poster?: string };

export interface PromoCarouselSlide {
  id: string;
  title?: string;
  subtitle?: string;
  media?: PromoMedia;
  cta?: { text: string; href: string };
  align?: 'left' | 'right' | 'center';
  bgColor?: string;
  // Стили для заголовка
  titleColor?: string;
  titleSize?: string;
  titleWeight?: string | number;
  titleLineHeight?: string;
  titleMargin?: string;
  // Стили для подзаголовка
  subtitleColor?: string;
  subtitleSize?: string;
  subtitleWeight?: string | number;
  subtitleLineHeight?: string;
  subtitleMargin?: string;
  subtitleOpacity?: number;
}

export interface PromoCarouselContent {
  kind: 'carousel';
  autoplay?: boolean;
  intervalMs?: number; // по умолчанию 6000
  showDots?: boolean; // по умолчанию true
  showArrows?: boolean; // по умолчанию true
  slides: PromoCarouselSlide[];
}

export interface PromoDropdownContent {
  kind: 'dropdown';
  bgColor?: string; // цвет полосы-аккордиона (как было)
  contentBgColor?: string; // НОВОЕ: фон раскрытой секции (по умолчанию #fff)
  contentTextColor?: string;
  barTextColor?: string; // НОВОЕ: цвет текста на баре (по умолчанию #f8fafc)
  barBorderColor?: string; // НОВОЕ: цвет рамки «двойной линии» (по умолчанию rgba(255,255,255,.85))
  options: PromoDropdownOption[];
  sectionBorder?: boolean;
}

export interface PromoDropdownCard {
  id: string;
  title?: string;
  description?: string;
  media?: PromoMedia;
  href?: string;
  ctaText?: string;
  // НОВОЕ: выравнивание текста в карточке
  titleAlign?: 'left' | 'center' | 'right';
  descriptionAlign?: 'left' | 'center' | 'right';
  color?: string;
}

export interface PromoDropdownOption {
  id: string;
  label: string;
  title?: string;
  subtitle?: string;
  cards?: PromoDropdownCard[];
}

export interface PromoHighlightsItem {
  id: string;
  title?: string;
  description?: string;
  media?: PromoMedia;
  href?: string;
  ctaText?: string;
  span?: SpanConfig; // <— НОВОЕ
  ratio?: '1:1' | '4:3' | '3:2' | '16:9' | number; // индивидуальное соотношение
  fit?: 'cover' | 'contain'; // индивидуальный object-fit
}

type SpanConfig = { sm?: number; md?: number; lg?: number };

export interface PromoHighlightsContent {
  kind: 'highlights';
  bgColor?: string;
  textColor?: string;
  heading?: string;
  subheading?: string;
  sectionBorder?: boolean;
  items: PromoHighlightsItem[];

  /** Вид раскладки: 'grid' — «квадратиками»; 'row' — в ряд крупные карточки */
  layout?: 'grid' | 'row';

  /** Колонки для grid-режима (по умолчанию: 1/2/4) */
  columnsSm?: number; // default 1
  columnsMd?: number; // default 2
  columnsLg?: number; // default 4

  /** Соотношение сторон медиа: '1:1' | '4:3' | '3:2' | '16:9' | число (0.66 => 66%) */
  mediaRatio?: '1:1' | '4:3' | '3:2' | '16:9' | number; // default 0.66

  /** Как вписывать медиа */
  mediaFit?: 'cover' | 'contain'; // default 'cover'
}

export type PromoCarouselPayload =
  | PromoCarouselContent
  | PromoDropdownContent
  | PromoHighlightsContent;
