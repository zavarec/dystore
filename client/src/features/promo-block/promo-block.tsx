import {
  CategoryPromoSection,
  CategoryPromoVariant,
} from '@/types/models/category-promo-section.model';
import { BannerSection } from './components/banner-section/banner-section';
import { TextSection } from './components/text-section/text-section';
import { GridSection } from './components/grid-section';
import { StripSection } from './components/strip-section';
import { PairSection } from './components/pair-saction';
import { HeadlineStripSection } from './components/headline-strip-section/headline-strip-section';

function renderByVariant(s: CategoryPromoSection) {
  switch (s.variant) {
    case CategoryPromoVariant.BANNER:
      return <BannerSection {...s} />;
    case CategoryPromoVariant.TEXT_STRIP:
      return <TextSection {...s} />;
    case CategoryPromoVariant.GRID:
      return <GridSection {...s} />;
    case CategoryPromoVariant.STRIP_USP:
      return <StripSection {...s} />;
    case CategoryPromoVariant.IMAGE_PAIR:
      return <PairSection {...s} />;
    case CategoryPromoVariant.TEXT_QUOTE:
      return <TextSection {...s} />;
    case (CategoryPromoVariant as any).HEADLINE_STRIP:
      return <HeadlineStripSection {...s} />;
    default:
      return <BannerSection {...s} />;
  }
}

export function PromoBlock({ sections }: { sections: CategoryPromoSection[] }) {
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
