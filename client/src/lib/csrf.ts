import csrf from 'csrf';
import type { NextApiRequest, NextApiResponse } from 'next';

const tokens = new csrf();

export function createCSRFToken(): { token: string; secret: string } {
  const secret = tokens.secretSync();
  const token = tokens.create(secret);
  return { token, secret };
}

export function verifyCSRFToken(
  secret: string | undefined,
  token: string | string[] | undefined,
): boolean {
  if (!secret || !token || Array.isArray(token)) return false;
  return tokens.verify(secret, token);
}

export function extractCSRFFromRequest(req: NextApiRequest) {
  const headerToken = (req.headers['x-csrf-token'] || req.headers['x-xsrf-token']) as
    | string
    | undefined;
  const bodyToken = (req.body && (req.body._csrf || req.body.csrfToken)) as string | undefined;
  const queryToken = (req.query && (req.query._csrf || req.query.csrfToken)) as string | undefined;

  const token = (() => {
    const source = headerToken || bodyToken || queryToken;
    if (typeof source !== 'string') return source;
    try {
      return decodeURIComponent(source);
    } catch {
      return source;
    }
  })();
  const secret = (req.cookies &&
    (req.cookies['csrf-secret'] || req.cookies['XSRF-TOKEN-SECRET'])) as string | undefined;
  return { token, secret };
}

export function requireCsrf(req: NextApiRequest, res: NextApiResponse): boolean {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method || '')) return true;
  const { token, secret } = extractCSRFFromRequest(req);
  if (!verifyCSRFToken(secret, token)) {
    res.status(403).json({ error: 'Invalid CSRF token' });
    return false;
  }
  return true;
}
