import type { NextApiRequest, NextApiResponse } from 'next';

import { requireCsrf } from '@/lib/csrf';

const BACKEND_API_URL = process.env.API_URL_SERVER || 'api/proxy';

function buildCookie(name: string, value: string, maxAgeSeconds: number) {
  const isProd = process.env.NODE_ENV === 'production';
  const parts = [
    `${name}=${value}`,
    'HttpOnly',
    'Path=/',
    `Max-Age=${maxAgeSeconds}`,
    'SameSite=Lax',
  ];
  if (isProd) parts.push('Secure');
  return parts.join('; ');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!requireCsrf(req, res)) return;

  try {
    const body = req.body || {};

    const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    const headersAny = response.headers as unknown as {
      getSetCookie?: () => string[];
      raw?: () => Record<string, string[]>;
    };
    const rawCookies = headersAny.raw?.();
    const setCookies = headersAny.getSetCookie?.() ?? rawCookies?.['set-cookie'] ?? [];

    if (setCookies.length === 0) {
      const token: string | undefined = data?.access_token;
      if (!token) {
        return res.status(500).json({ message: 'Не удалось получить токен' });
      }

      const maxAge = 60 * 60 * 24;
      res.setHeader('Set-Cookie', buildCookie('access_token', token, maxAge));
    } else {
      res.setHeader('Set-Cookie', setCookies);
    }

    return res.status(200).json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(500).json({ message: error?.message || 'Internal Server Error' });
  }
}
