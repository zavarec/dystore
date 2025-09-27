import type { NextApiRequest, NextApiResponse } from 'next';

import { createCSRFToken } from '@/lib/csrf';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token, secret } = createCSRFToken();
  const isProd = process.env.NODE_ENV === 'production';
  const cookies: string[] = [];
  // HttpOnly секрет для проверки на сервере
  cookies.push(`csrf-secret=${secret}; Path=/; SameSite=Lax; HttpOnly${isProd ? '; Secure' : ''}`);
  // Доступный JS токен, чтобы axios/fetch могли положить его в заголовок
  cookies.push(
    `XSRF-TOKEN=${encodeURIComponent(token)}; Path=/; SameSite=Lax${isProd ? '; Secure' : ''}`,
  );

  res.setHeader('Set-Cookie', cookies);
  res.status(200).json({ csrfToken: token });
}
