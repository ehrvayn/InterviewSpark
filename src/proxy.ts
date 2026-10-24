import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { AUTH_COOKIE } from "@/lib/auth";

const PROTECTED_ROUTES = ["/interview", "/dashboard", "/payment"];

function isAuthenticated(token: string | undefined): boolean {
  if (!token) return false;
  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    return true;
  } catch {
    return false;
  }
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const authenticated = isAuthenticated(token);

  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isProtected && !authenticated) {
    const response = NextResponse.redirect(new URL("/", request.url));
    if (token) response.cookies.delete(AUTH_COOKIE);
    return response;
  }

  if (pathname === "/" && authenticated) {
    return NextResponse.redirect(new URL("/interview", request.url));
  }

  if (pathname === "/" && token && !authenticated) {
    const response = NextResponse.next();
    response.cookies.delete(AUTH_COOKIE);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/interview/:path*", "/dashboard/:path*", "/payment/:path*"],
};



