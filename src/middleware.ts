import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/", "/dashboard", "/profile", "/settings"];
  const authRoutes = ["/signin", "/signup"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(route + "/")
  );

  const isAuthRoute = authRoutes.some((route) =>
    pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (isAuthRoute && token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
      return NextResponse.redirect(new URL("/", request.url));
    } catch {
      const response = NextResponse.next();
      response.cookies.delete("auth_token");
      return response;
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};