import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_LOCALES = ['en', 'so', 'ar'];
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

// --- Paths that DO NOT require authentication ---
const PUBLIC_PATHS = [
    '/api/login', // If you have a separate API route for login
    '/admin/login',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('session')?.value;
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // --- 1. API Route Authentication ---------------------
  if (pathname.startsWith('/api')) {
    // If it's a public API path (like login), let it pass
    if (isPublicPath) {
      return NextResponse.next();
    }

    // Otherwise, require a session
    if (!session) {
      // Return a 401 Unauthorized response for API calls
      return new NextResponse(
          JSON.stringify({ success: false, message: 'Authentication required.' }),
          { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
    
    // Verify the JWT session
    try {
      await jwtVerify(session, SECRET_KEY);
      return NextResponse.next(); // Valid token, proceed
    } catch (e) {
      // Invalid token
      return new NextResponse(
          JSON.stringify({ success: false, message: 'Invalid or expired token.' }),
          { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  // --- 2. Protect Admin Routes (UI) ---------------------
  if (pathname.startsWith('/admin')) {
    // If user is trying to access /admin/login, let them pass
    if (isPublicPath) {
      return NextResponse.next();
    }

    // Redirect /admin to /admin/dashboard
    if (pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Require session for all other admin pages
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verify the JWT session for admin UI pages
    try {
      await jwtVerify(session, SECRET_KEY);
      // Valid token, proceed
      return NextResponse.next();
    } catch {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // --- 3. Public Locale Routing ---------------------
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
  // Matches all paths except static files, _next internal paths, etc.
  matcher: ['/((?!_next|static|.*\\..*).*)'],
};