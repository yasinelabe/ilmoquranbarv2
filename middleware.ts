import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_LOCALES = ['en', 'so', 'ar'];
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- 1. Protect Admin Routes ---------------------
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    const session = request.cookies.get('session')?.value;
    if (!session && pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      if (session) await jwtVerify(session, SECRET_KEY);
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next();
  }

  // --- 2. Public Locale Routing ---------------------
  const segments = pathname.split('/');
  const locale = segments[1];

  const isLocale = PUBLIC_LOCALES.includes(locale);

  // Read saved language from cookie
  const savedLang = request.cookies.get("preferred-language")?.value;

  // No locale in URL → redirect to preferred or default
  if (!isLocale) {
    const targetLocale =
      savedLang && PUBLIC_LOCALES.includes(savedLang)
        ? savedLang
        : "en";

    return NextResponse.redirect(
      new URL(`/${targetLocale}${pathname}`, request.url)
    );
  }

  // Locale exists → continue
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|static|.*\\..*).*)'],
};