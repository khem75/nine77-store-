import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';
const MOCK_TOKEN = 'nine77-mock-admin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── MOCK MODE ──────────────────────────────────────────────
  if (IS_MOCK) {
    const token = request.cookies.get('nine77-admin-token')?.value;

    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
      if (token !== MOCK_TOKEN) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    if (pathname === '/admin/login') {
      if (token === MOCK_TOKEN) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }

    return NextResponse.next();
  }

  // ── REAL MODE (Supabase SSR) ───────────────────────────────
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!user) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === '/admin/login') {
    if (user) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
};
