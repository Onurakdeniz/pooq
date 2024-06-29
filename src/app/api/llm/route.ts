import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createHmac } from "crypto";

// Initialize Prisma client
const prisma = new PrismaClient();

// Define the expected structure of the webhook data
interface WebhookData {
  cast: {
    hash: string;
  };
  text: string;
}

// Define the structure of the LLM response
interface LLMResponse {
  success: boolean;
  data?: unknown; // Adjust based on actual structure
  error?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
  
    const sig = req.headers.get("X-Neynar-Signature");
    if (!sig) {
      throw new Error("Neynar signature missing from request headers");
    }

    const webhookSecret = process.env.NEYNAR_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Make sure you set NEYNAR_WEBHOOK_SECRET in your .env file");
    }

    const hmac = createHmac("sha512", webhookSecret);
    hmac.update(body);

    const generatedSignature = hmac.digest("hex");

    const isValid = generatedSignature === sig;
    if (!isValid) {
      throw new Error("Invalid webhook signature");
    }
  
    const hookData: WebhookData = JSON.parse(body);

    // Define the Fleek Functions URL
    const fleekFunctionUrl = 'https://full-napkin-square.functions.on-fleek.app';
    
    // Perform the LLM request
    const llmResponse = await fetch(fleekFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: hookData.cast.hash,
        text: hookData.text,
        type: "STORY",
        hash: hookData.cast.hash
      }),
    });

    if (!llmResponse.ok) {
      throw new Error('Failed to process story with LLM');
    }

    const llmResult: LLMResponse = await llmResponse.json();
    console.log("llmResult", llmResult);

    return NextResponse.json({
      success: true,
      llmResult,
    });
  } catch (error: unknown) {
    console.error('Error processing story:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }   
}
