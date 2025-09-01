import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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

    const token: string | undefined = data?.access_token;
    if (!token) {
      return res.status(500).json({ message: 'Не удалось получить токен' });
    }

    // 1 день
    const maxAge = 60 * 60 * 24;
    res.setHeader('Set-Cookie', buildCookie('access_token', token, maxAge));

    return res.status(200).json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ message: error?.message || 'Internal Server Error' });
  }
}
