import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicRoutes = ["/login", "/signup", "/"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // We read the 'token' cookie to determine if the user is authenticated
  const token = request.cookies.get("token")?.value;

  const isPublicRoute = publicRoutes.includes(pathname);

  // If the user hits /logout, clear cookies and redirect to login
  if (pathname === '/logout') {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    response.cookies.delete('userName');
    response.cookies.delete('userEmail');
    return response;
  }

  // If the user is authenticated and trying to access login/signup, redirect to dashboard
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the user is NOT authenticated and trying to access a protected route
  // We allow the root '/' to be public as a landing page.
  if (!token && !isPublicRoute && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

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
     * - any image or static assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:png|jpg|jpeg|svg|gif|webp)$).*)",
  ],
};
