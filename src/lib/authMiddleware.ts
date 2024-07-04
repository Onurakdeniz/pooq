import { NextRequest, NextResponse } from "next/server";
import prisma from "./prisma";
import { cookies } from "next/headers";
import { privy } from "./privy";

export const dynamic = "force-dynamic";

export type AuthMiddlewareResult = 
  | { id: string }
  | NextResponse 
  | undefined;

export async function authMiddleware(req: NextRequest): Promise<AuthMiddlewareResult> {
  const accessToken = cookies().get("privy-token");

  if (!accessToken) {
    console.log("Access token is missing");
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const result = await privy.verifyAuthToken(accessToken.value);
    const privyUserId = result.userId;

    if (!privyUserId) {
      console.log("User ID not found in token");
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: privyUserId },
      select: { id: true },
    });

    if (!currentUser) {
      console.log("User not found in database");
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return currentUser;
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}