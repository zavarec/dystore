export async function fetchSeoMetaSSR(
  pageType: 'CATEGORY' | 'PRODUCT' | 'LANDING' | 'STATIC',
  entityId: string,
  locale = 'ru',
) {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const url = `${API}/seo-meta/${encodeURIComponent(pageType)}/${encodeURIComponent(entityId)}?locale=${encodeURIComponent(locale)}`;

  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    return null;
  }
  return await res.json();
}
