import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { secret, slug } = req.method === 'POST' ? req.body : req.query;

    if (secret !== process.env.REVALIDATE_SECRET) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ message: 'Missing slug' });
    }

    // Путь должен соответствовать реальному роуту страницы товара!
    // canonical = https://dyson-group.ru/product/${slug}, значит путь:
    const path = `/product/${slug}`;

    await res.revalidate(path);
    return res.json({ revalidated: true, path });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error?.message ?? 'revalidate failed' });
    }
  }
}
