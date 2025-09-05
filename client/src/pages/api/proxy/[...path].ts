import type { NextApiRequest, NextApiResponse } from 'next';
import { requireCsrf } from '@/lib/csrf';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method || '')) {
    if (!requireCsrf(req, res)) return;
  }
  const { path = [] } = req.query as { path: string[] };
  const targetUrl = `${BACKEND_API_URL}/${path.join('/')}${req.url?.includes('?') ? req.url?.substring(req.url.indexOf('?')) : ''}`;

  const accessToken = req.cookies['access_token'];

  const headers: Record<string, string> = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (!value) continue;
    const lower = key.toLowerCase();
    if (['host', 'connection', 'accept-encoding', 'content-length'].includes(lower)) continue;
    headers[key] = Array.isArray(value) ? value.join(', ') : value;
  }
  // Пробрасываем куки на бэкенд (нужно для CART_COOKIE и др.)
  if (req.headers.cookie) {
    headers['cookie'] = Array.isArray(req.headers.cookie)
      ? req.headers.cookie.join('; ')
      : req.headers.cookie;
  }
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const init: RequestInit = {
      method: req.method || 'GET',
      headers,
    };
    if (req.method && !['GET', 'HEAD'].includes(req.method)) {
      init.body = (req as any).body ? JSON.stringify(req.body) : null;
    }

    const response = await fetch(targetUrl, init);

    const contentType = response.headers.get('content-type') || '';
    res.status(response.status);
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'content-encoding') return;
      if (key.toLowerCase() === 'content-length') return;
      res.setHeader(key, value);
    });

    if (contentType.includes('application/json')) {
      const data = await response.json().catch(() => ({}));
      return res.json(data);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    return res.send(buffer);
  } catch (error: any) {
    return res.status(500).json({ message: error?.message || 'Proxy error' });
  }
}
