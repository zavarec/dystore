import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Простой middleware: если нет access_token куки — редиректим с /admin на /admin/login
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Защищаем только /admin и подмаршруты
  const isAdminPath = pathname.startsWith('/admin');
  if (!isAdminPath) return NextResponse.next();

  const token = req.cookies.get('access_token')?.value;
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
