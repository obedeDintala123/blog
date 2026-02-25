import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  const isAuthRoute = pathname.startsWith("/auth");
  const isPrivateRoute = pathname.startsWith("/posts/create");

  if (!token && isPrivateRoute) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/posts/create", "/auth/:path*"],
};
