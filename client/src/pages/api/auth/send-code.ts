import type { NextApiRequest, NextApiResponse } from 'next';

import { requireCsrf } from '@/lib/csrf';

const BACKEND_API_URL = process.env.API_URL_SERVER || 'http://localhost:3001/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!requireCsrf(req, res)) return;

  try {
    const body = req.body || {};

    const response = await fetch(`${BACKEND_API_URL}/auth/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error?.message || 'Internal Server Error' });
    }
  }
}
