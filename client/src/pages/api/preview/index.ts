import type { NextApiRequest, NextApiResponse } from 'next';

const PREVIEW_SECRET = process.env.NEXT_PREVIEW_SECRET ?? process.env.PREVIEW_SECRET;

const safeRedirect = (slugParam: string | string[] | undefined): string => {
  if (!slugParam) return '/';
  const slug = Array.isArray(slugParam) ? slugParam.join('/') : slugParam;
  if (!slug) return '/';
  return slug.startsWith('/') ? slug : `/${slug}`;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!PREVIEW_SECRET) {
    return res.status(500).json({ message: 'Preview secret is not configured on the server' });
  }

  const { secret, slug = '/' } = req.query;

  if (!secret || secret !== PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid preview token' });
  }

  res.setPreviewData({});
  const destination = safeRedirect(slug);

  res.writeHead(307, { Location: destination });
  res.end();
}
