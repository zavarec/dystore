import type { PromoPageType } from '@/types/models/promo-placement.model';

export async function fetchPromoForPageSSR(pageType: PromoPageType, entityId: string) {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  const url = `${API}/promo?pageType=${encodeURIComponent(pageType)}&entityId=${encodeURIComponent(entityId)}`;
  const res = await fetch(url);

  if (!res.ok) return [];
  return res.json();
}
