import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/signup", "/", "/about", "/contact"];
const PROTECTED_ROUTES = ["/dashboard", "/admin", "/profile", "/settings"];
const API_ROUTES = ["/api"];

const matchesPattern = (pathname: string, patterns: string[]) => {
  return patterns.some(
    (pattern) => pathname === pattern || pathname.startsWith(`${pattern}/`)
  );
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({ name, value: "", ...options });
          }
        }
      }
    );

    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Auth error:", error.message);

      response.cookies.set({
        name: "sb-access-token",
        value: "",
        expires: new Date(0)
      });
      response.cookies.set({
        name: "sb-refresh-token",
        value: "",
        expires: new Date(0)
      });
    }

    if (matchesPattern(request.nextUrl.pathname, API_ROUTES)) {
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", user.id);
      requestHeaders.set("x-user-email", user.email || "");

      const role = user.app_metadata?.role || "user";
      requestHeaders.set("x-user-role", role);

      if (
        request.nextUrl.pathname.startsWith("/api/admin") &&
        role !== "admin"
      ) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const updatedRequest = new Request(request.url, {
        headers: requestHeaders,
        method: request.method,
        body: request.body,
        redirect: request.redirect,
        signal: request.signal
      });

      return NextResponse.next({
        request: updatedRequest
      });
    }

    if (matchesPattern(request.nextUrl.pathname, PROTECTED_ROUTES)) {
      if (!user) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (request.nextUrl.pathname.startsWith("/admin")) {
        const role = user.app_metadata?.role || "user";
        if (role !== "admin") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
    }
    if (matchesPattern(request.nextUrl.pathname, PUBLIC_ROUTES)) {
      if (user) {
        const redirectTo = request.cookies.get("redirectTo")?.value;
        if (redirectTo) {
          response.cookies.set({
            name: "redirectTo",
            value: "",
            expires: new Date(0)
          });
          return NextResponse.redirect(new URL(redirectTo, request.url));
        }
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return response;
  } catch (err) {
    console.error("Middleware error:", err);
    return response;
  }
}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|assets/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)"
  ]
};
