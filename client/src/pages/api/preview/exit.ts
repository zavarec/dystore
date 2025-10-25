import type { NextApiRequest, NextApiResponse } from 'next';

const safeRedirect = (slugParam: string | string[] | undefined): string => {
  if (!slugParam) return '/';
  const slug = Array.isArray(slugParam) ? slugParam.join('/') : slugParam;
  if (!slug) return '/';
  return slug.startsWith('/') ? slug : `/${slug}`;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug = '/' } = req.query;
  const destination = safeRedirect(slug);

  res.clearPreviewData();
  res.writeHead(307, { Location: destination });
  res.end();
}
