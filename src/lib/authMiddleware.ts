import { NextRequest, NextResponse } from "next/server";
import prisma from "./prisma";
import { cookies } from "next/headers";
import { privy } from "./privy";

export const dynamic = "force-dynamic";

export type AuthMiddlewareResult = 
  | { id: string } // for the currentUser object
  | NextResponse 
  | undefined;

  export async function authMiddleware(req: NextRequest): Promise<AuthMiddlewareResult> {
  try {
    const accessToken = cookies().get("privy-token");

    if (!accessToken) {
      console.log("Access token is undefined");
      return;
    }

    const result = await privy.verifyAuthToken(accessToken.value);
    const { userId: privyUserId } = result;
    console.log("privyid",privyUserId)

    if (!privyUserId) {
      console.error("Unauthorized: User ID not found");
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: privyUserId }, // Changed from privyUserId to pid
      select: { id: true },
    });

    if (!currentUser) {
      console.error("User not found");
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return currentUser;
  } catch (error) {
    console.error("Error in authMiddleware", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}