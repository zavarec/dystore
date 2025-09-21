import { PromoPlacement, PromoSlot } from '@/types/models/promo-placement.model';

export function groupBySlot(placements: PromoPlacement[]) {
  return placements.reduce<Record<PromoSlot, PromoPlacement[]>>(
    (acc, p) => {
      (acc[p.slot] ||= []).push(p);
      return acc;
    },
    {} as Record<PromoSlot, PromoPlacement[]>,
  );
}
