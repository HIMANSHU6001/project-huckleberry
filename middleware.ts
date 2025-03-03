
import { type NextRequest } from "next/server";
// import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  if (request) {
    console.log("hi");
  }
  return null;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
