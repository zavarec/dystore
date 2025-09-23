import type { NextApiRequest, NextApiResponse } from 'next';

import { requireCsrf } from '../../../lib/csrf';

const BACKEND_API_URL = process.env.API_URL_SERVER || 'http://api:3001/api';

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
    } as RequestInit;
    if (req.method && !['GET', 'HEAD'].includes(req.method)) {
      // Для всех небезтелесных запросов проксируем сырой поток и указываем duplex
      (init as any).body = req;
      (init as any).duplex = 'half';
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
    console.error('Proxy error', {
      targetUrl,
      method: req.method,
      message: error?.message,
      code: error?.code,
      cause: String(error?.cause || ''),
    });
    return res.status(502).json({ message: 'proxy error', targetUrl });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
