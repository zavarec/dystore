import type { PromoSection } from '@/types/models/promo-section.model';
import { PromoVariant } from '@/types/models/promo-section.model';

import { BannerSection } from './components/banner-section/banner-section';
import { GridSection } from './components/grid-section';
import { HeadlineStripSection } from './components/headline-strip-section/headline-strip-section';
import { PairSection } from './components/pair-saction';
import { PromoCarouselSection } from './components/promo-carousel-section/promo-carousel-section';
import { StripSection } from './components/strip-section';
import { TextSection } from './components/text-section/text-section';

function renderByVariant(s: PromoSection) {
  switch (s.variant) {
    case PromoVariant.BANNER:
      return <BannerSection {...s} />;
    case PromoVariant.TEXT_STRIP:
      return <TextSection {...s} />;
    case PromoVariant.GRID:
      return <GridSection {...s} />;
    case PromoVariant.STRIP_USP:
      return <StripSection {...s} />;
    case PromoVariant.IMAGE_PAIR:
      return <PairSection {...s} />;
    case PromoVariant.TEXT_QUOTE:
      return <TextSection {...s} />;
    case PromoVariant.HEADLINE_STRIP:
      return <HeadlineStripSection {...s} />;
    case PromoVariant.CAROUSEL:
      return <PromoCarouselSection {...s} />;
    default:
      return <BannerSection {...s} />;
  }
}

export function PromoBlock({ sections }: { sections: PromoSection[] }) {
  if (!sections || sections.length === 0) return null;
  return (
    <>
      {sections
        .filter(s => s.isActive !== false) // на всякий
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map(s => renderByVariant(s))}
    </>
  );
}
