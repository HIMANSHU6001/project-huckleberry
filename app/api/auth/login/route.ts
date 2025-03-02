import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/client";
// import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();
const supabase = createClient();

const createErrorResponse = (message: string, status: number) => {
  return new NextResponse(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" }
  });
};

export async function POST(request: Request) {
  // console.log("hello from backend");
  try {
    const { token, refreshToken } = await request.json();
    console.log(token);

    if (!token) {
      return createErrorResponse("Access token is required", 400);
    }

    const {
      data: { user },
      error
    } = await supabase.auth.getUser(token);
    if (error || !user) {
      return createErrorResponse("Invalid token", 401);
    }

    const email = user.email?.toLowerCase();

    console.log(email);
    if (!email) {
      return createErrorResponse("Email not found in token", 400);
    }

    const member = await prisma.member.findUnique({ where: { email } });
    // if (!member) {
    //   return createErrorResponse("Member not found", 404);
    // }

    const maxAge = 7 * 24 * 60 * 60;
    const cookies = [
      `sb-access-token=${token}; Max-Age=${maxAge}; Path=/; Secure; HttpOnly; SameSite=Strict`,
      `sb-refresh-token=${refreshToken}; Max-Age=${maxAge}; Path=/; Secure; HttpOnly; SameSite=Strict`,
      `email=${email}; Max-Age=${maxAge}; Path=/; Secure; SameSite=Strict`
    ];

    return new NextResponse(
      JSON.stringify({
        message: "Login successful",
        user: {
          // id: member?.id,
          email: member?.email,
          isAdmin: member?.is_admin || true
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookies.join(", ")
        }
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return createErrorResponse("Internal server error", 500);
  } finally {
    await prisma.$disconnect();
  }
}
