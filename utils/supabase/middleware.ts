import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/signup"];
const PROTECTED_ROUTES = ["/dashboard", "/admin"];
const API_ROUTES = ["/api"];

const matchesPattern = (pathname: string, patterns: string[]) => {
  return patterns.some((pattern) => pathname.startsWith(pattern));
};

export async function updateSession(request: NextRequest) {
  const requestUrl = request.nextUrl.clone();
  const { pathname } = requestUrl;

  let response = NextResponse.next({
    request
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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        }
      }
    }
  );

  try {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    const returnTo = request.nextUrl.pathname;

    if (!user) {
      // If user is not authenticated
      if (
        matchesPattern(pathname, PROTECTED_ROUTES) ||
        matchesPattern(pathname, API_ROUTES)
      ) {
        const loginUrl = new URL("/login", request.url);
        if (!matchesPattern(returnTo, PUBLIC_ROUTES)) {
          loginUrl.searchParams.set("returnTo", returnTo);
        }
        return NextResponse.redirect(loginUrl);
      }
    } else {
      if (matchesPattern(pathname, PUBLIC_ROUTES)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      if (matchesPattern(pathname, API_ROUTES)) {
        response.headers.set("x-user-id", user.id);
        response.headers.set("x-user-role", user.role?.toString() ?? "user");
      }
    }

    return response;
  } catch (error) {
    console.error("Auth middleware error:", error);
    if (matchesPattern(pathname, PROTECTED_ROUTES)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return response;
  }
}
