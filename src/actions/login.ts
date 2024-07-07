"use server";

import { privy } from "@/lib/privy";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

// Use a singleton pattern for Prisma client
const prisma = new PrismaClient();

async function upsertUser(userId: string, fid: number | null, userName: string | null): Promise<void> {
  await prisma.user.upsert({
    where: { id: userId },
    update: {
      fid: fid,
      userName: userName,
    },
    create: {
      id: userId,
      fid: fid,
      userName: userName,
      createdAt: new Date(),
    },
  });
  console.log(`Upserting user with ID: ${userId}, FID: ${fid}, UserName: ${userName}`);
}

export async function loginUser(userId: string) {
  const cookieStore = cookies();

  // Retrieve privyId from cookies
  const privyId = cookieStore.get("privy_id")?.value;

  if (!privyId) {
    console.error("Privy ID not found in cookies");
    return { success: false, error: "Privy ID not found" };
  }

  try {
    const user = await privy.getUser(privyId);
    
    // Find Farcaster account
    const farcasterAccount = user.linkedAccounts.find(account => account.type === 'farcaster');
    
    // Extract fid and userName
    let fid: number | null = null;
    if (farcasterAccount && 'fid' in farcasterAccount) {
      fid = typeof farcasterAccount.fid === 'string' ? parseInt(farcasterAccount.fid, 10) : farcasterAccount.fid;
    }
    
    // Handle potential undefined value for userName
    let userName: string | null = null;
    if (farcasterAccount && 'username' in farcasterAccount && farcasterAccount.username) {
      userName = farcasterAccount.username;
    }

    await upsertUser(userId, fid, userName);
    console.log("User logged in:", { userId, fid, userName });
    return { success: true };
  } catch (error) {
    console.error("Failed to upsert user:", error);
    return { success: false, error: "Login failed" };
  }
}