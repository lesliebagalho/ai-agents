import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "estoque_session";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const publicPath = pathname === "/login" || pathname.startsWith("/api/");
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (!hasSession && !publicPath && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasSession && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
