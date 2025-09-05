import { type GetServerSideProps } from 'next';

import { type UserRole } from '@/types/models/user.model';

export function withRoleServerGuard(
  allowed: UserRole[],
  getProps?: GetServerSideProps,
): GetServerSideProps {
  return async ctx => {
    const token = ctx.req.cookies['access_token'];
    const next = encodeURIComponent(ctx.resolvedUrl || '/');
    if (!token) {
      return { redirect: { destination: `/admin/login?next=${next}`, permanent: false } };
    }

    const api = process.env.API_URL_INTERNAL || 'http://localhost:3001/api'; // лучше не NEXT_PUBLIC_ на сервере
    const meRes = await fetch(`${api}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!meRes.ok) {
      return { redirect: { destination: `/admin/login?next=${next}`, permanent: false } };
    }
    const me = await meRes.json();
    if (!allowed.includes(me?.role)) {
      return { redirect: { destination: '/', permanent: false } };
    }

    return getProps ? getProps(ctx) : { props: {} };
  };
}
