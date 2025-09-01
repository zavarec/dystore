import type { NextApiRequest, NextApiResponse } from 'next';
import { requireCsrf } from '@/lib/csrf';

function clearCookie(name: string) {
  const isProd = process.env.NODE_ENV === 'production';
  const parts = [`${name}=`, 'HttpOnly', 'Path=/', 'Max-Age=0', 'SameSite=Lax'];
  if (isProd) parts.push('Secure');
  return parts.join('; ');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!requireCsrf(req, res)) return;

  res.setHeader('Set-Cookie', [clearCookie('access_token')]);
  return res.status(200).json({ success: true });
}
