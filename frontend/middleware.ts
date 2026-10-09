import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  const hasAccessToken = request.cookies.has('accessToken');
  const hasRefreshToken = request.cookies.has('refreshToken');
  
  // If we have either token, we consider the user at least potentially authenticated
  const isAuthenticated = hasAccessToken || hasRefreshToken;

  if (isAuthenticated && isPublicRoute) {
    // Determine redirect based on something in cookies or default to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isAuthenticated && !isPublicRoute) {
    // If not authenticated and trying to access a protected route (anything not in publicRoutes, assuming / is not public either, or we protect specific paths)
    // Actually, let's just protect all routes except publicRoutes and static files
    
    // Check if it's an API route or static asset
    const isApiRoute = pathname.startsWith('/api');
    const isStaticRoute = pathname.match(/\.(.*)$/);
    
    if (!isApiRoute && !isStaticRoute) {
      let callbackUrl = pathname;
      if (request.nextUrl.search) {
        callbackUrl += request.nextUrl.search;
      }
      
      const loginUrl = new URL('/login', request.url);
      if (callbackUrl !== '/' && callbackUrl !== '/dashboard') {
        loginUrl.searchParams.set('callbackUrl', callbackUrl);
      }
      
      return NextResponse.redirect(loginUrl);
    }
  }

  // Role checking cannot be done directly here since JWT is HTTP-only and we might only have a refresh token.
  // Real role protection for /admin is handled in layout / wrapper, but we can do a simple check if we stored role in a cookie.
  // For now, let it pass to the components for strict checks.

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
