import React from 'react';
import { PlacementWrap } from '@/components/atoms/placement-wrap/placement-wrap';
import { PromoBlock } from '@/features/promo-block/promo-block';
import { PromoPlacement } from '@/types/models/promo-placement.model';
import { PromoSection, PromoSlot } from '@/types/models/promo-section.model';

function adaptPlacementToSection(p: PromoPlacement): PromoSection | null {
  const s = (p as any).promoSection;
  if (!s) return null;
  return {
    id: s.id as number,
    categoryId: (s.categoryId as number) ?? 0,
    variant: s.variant as any,
    placement: p.slot as any,
    order: (p.order as number) ?? 0,
    isActive: Boolean(s.isActive),

    title: s.title ?? null,
    subtitle: s.subtitle ?? null,
    imageUrl: s.imageUrl ?? null,
    videoUrl: s.videoUrl ?? null,
    ctaText: s.ctaText ?? null,
    ctaLink: s.ctaLink ?? null,

    font: s.font ?? null,
    titleColor: s.titleColor ?? null,
    textColor: s.textColor ?? null,
    ctaBg: s.ctaBg ?? null,
    ctaColor: s.ctaColor ?? null,
    bgColor: (p as any).bgColor ?? s.bgColor ?? null,
    contentSide: (p as any).contentSide ?? s.contentSide ?? null,
    heightPx: s.heightPx ?? null,

    paddingTopPx: s.paddingTopPx ?? null,
    paddingBottomPx: s.paddingBottomPx ?? null,
    contentFontSizePx: s.contentFontSizePx ?? null,
    titleFontSizePx: s.titleFontSizePx ?? null,

    startsAt: s.startsAt ?? null,
    endsAt: s.endsAt ?? null,

    content: s.content ?? null,
  } as PromoSection;
}

export function PromoSlotRenderer({
  placements,
  slot,
}: {
  placements: PromoPlacement[];
  slot: PromoSlot;
}) {
  const items = (placements || []).filter(p => p.slot === slot && !!(p as any).promoSection);
  if (items.length === 0) return null;

  return (
    <>
      {items.map(p => {
        const section = adaptPlacementToSection(p);
        if (!section) return null;
        return (
          <PlacementWrap key={p.id} p={p}>
            <PromoBlock sections={[section]} />
          </PlacementWrap>
        );
      })}
    </>
  );
}
