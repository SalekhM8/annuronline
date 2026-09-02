import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ROLE_PREFIXES: Record<string, string[]> = {
  "/student": ["STUDENT"],
  "/teacher": ["TEACHER", "ADMIN"],
  "/admin": ["ADMIN"],
};

function homeFor(role: string) {
  if (role === "ADMIN") return "/admin";
  if (role === "TEACHER") return "/teacher";
  return "/student";
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const login = new URL("/login", req.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }

  for (const [prefix, roles] of Object.entries(ROLE_PREFIXES)) {
    if (pathname.startsWith(prefix) && !roles.includes(token.role as string)) {
      return NextResponse.redirect(new URL(homeFor(token.role as string), req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/teacher/:path*", "/admin/:path*"],
};
