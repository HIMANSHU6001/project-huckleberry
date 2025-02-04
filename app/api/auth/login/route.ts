// app/api/login/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const createErrorResponse = (message: string, status: number) => {
  return new NextResponse(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" }
  });
};

export async function POST(request: Request) {
  console.log("hello from backed");
  try {
    const { token } = await request.json();

    if (!token) {
      return createErrorResponse("Access token is required", 400);
    }

    // Verify token with Supabase
    const {
      data: { user },
      error
    } = await supabase.auth.getUser(token);
    if (error || !user) {
      return createErrorResponse("Invalid token", 401);
    }

    const email = user.email?.toLowerCase();
    if (!email) {
      return createErrorResponse("Email not found in token", 400);
    }

    // Check member in database
    let member = await prisma.member.findUnique({ where: { email } });
    if (!member) {
      return createErrorResponse("Member not found", 404);
    }

    // Update admin status if applicable
    if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && !member.is_admin) {
      member = await prisma.member.update({
        where: { email },
        data: { is_admin: true }
      });
    }

    // Set cookies or session as needed
    const maxAge = 7 * 24 * 60 * 60; // 1 week
    const cookies = [
      `token=${token}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Strict`,
      `email=${encodeURIComponent(
        email
      )}; Max-Age=${maxAge}; Path=/; Secure; SameSite=Strict`
    ];

    return new NextResponse(
      JSON.stringify({
        message: "Login successful",
        user: {
          id: member.id,
          email: member.email,
          isAdmin: member.is_admin
          // Include other user fields as needed
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
