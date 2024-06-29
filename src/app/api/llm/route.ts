import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface LLMResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

interface WebhookData {
  created_at: number;
  type: string;
  data: {
    object: string;
    hash: string;
    thread_hash: string;
    parent_hash: string | null;
    parent_url: string | null;
    root_parent_url: string | null;
    parent_author: { fid: number | null };
    author: {
      object: string;
      fid: number;
      custody_address: string;
      username: string;
      display_name: string;
      pfp_url: string;
      profile: unknown;
      follower_count: number;
      following_count: number;
      verifications: string[];
      verified_addresses: unknown;
      active_status: string;
      power_badge: boolean;
    };
    text: string;
    timestamp: string;
    embeds: unknown[];
    reactions: {
      likes_count: number;
      recasts_count: number;
      likes: unknown[];
      recasts: unknown[];
    };
    replies: { count: number };
    channel: unknown;
    mentioned_profiles: unknown[];
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const sig = req.headers.get('X-Neynar-Signature');
    if (!sig) {
      throw new Error('Neynar signature missing from request headers');
    }

    const webhookSecret = process.env.NEYNAR_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('Make sure you set NEYNAR_WEBHOOK_SECRET in your .env file');
    }

    const hmac = createHmac('sha512', webhookSecret);
    hmac.update(body);

    const generatedSignature = hmac.digest('hex');
    const isValid = generatedSignature === sig;
    if (!isValid) {
      throw new Error('Invalid webhook signature');
    }

    let hookData: WebhookData;

    try {
      hookData = JSON.parse(body) as WebhookData;
      console.log("Received webhook data:", JSON.stringify(hookData, null, 2));
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error('Invalid JSON in request body');
    }

    // Validate the structure
    if (!hookData.type || !hookData.data?.hash || !hookData.data?.text) {
      console.error("Invalid data structure. Received:", JSON.stringify(hookData, null, 2));
      throw new Error('Invalid structure for WebhookData: missing required fields');
    }

    const { data } = hookData;

    // Check if the author exists, if not create a new author
    let author = await prisma.author.findUnique({
      where: { fid: data.author.fid },
    });

    if (!author) {
      author = await prisma.author.create({
        data: {
          fid: data.author.fid,
          userName: data.author.username,
        },
      });
    }

    // Create a new story
    const story = await prisma.story.create({
      data: {
        hash: data.hash,
        text: data.text,
        authorId: author.fid,
        isProcessed: false,
      },
    });

    console.log('Saved story:', story);

    // Define the Fleek Functions URL
    const fleekFunctionUrl = 'https://full-napkin-square.functions.on-fleek.app';

    // Perform the LLM request
    const llmResponse = await fetch(fleekFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: data.hash,
        text: data.text,
        type: "STORY",
        hash: data.hash
      }),
    });

    if (!llmResponse.ok) {
      throw new Error('Failed to process story with LLM');
    }

    const llmResult = await llmResponse.json() as LLMResponse;

    console.log('LLM Result:', llmResult);

    // Update the story as processed after LLM processing
    await prisma.story.update({
      where: { id: story.id },
      data: { isProcessed: true },
    });

    // Check if a user with this fid exists, if not create one
    let user = await prisma.user.findUnique({
      where: { fid: data.author.fid },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          fid: data.author.fid,
          pid: data.author.custody_address, // Assuming custody_address is the pid
          username: data.author.username,
          isRegistered: false, // Set to false by default
        },
      });
    }

    return NextResponse.json({
      success: true,
      llmResult,
      savedStory: story,
    });
  } catch (error: unknown) {
    console.error('Error processing story:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}