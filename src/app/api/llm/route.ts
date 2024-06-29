import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

// Define the structure of the LLM response
interface LLMResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

// Define the structure of the incoming webhook data
interface WebhookData {
  cast: {
    object: string;
    hash: string;
    thread_hash: string;
    parent_hash: string | null;
    parent_url: string | null;
    root_parent_url: string | null;
    parent_author: {
      fid: number | null;
    };
    author: {
      object: string;
      fid: number;
      custody_address: string;
      username: string;
      display_name: string;
      pfp_url: string;
      profile: {
        bio: {
          text: string;
        };
      };
      follower_count: number;
      following_count: number;
      verifications: string[];
      active_status: string;
    };
    text: string;
    timestamp: string;
    embeds: Array<{ url: string }>;
    reactions: {
      likes_count: number;
      recasts_count: number;
      likes: Array<{ fid: number; fname: string }>;
      recasts: Array<{ fid: number; fname: string }>;
    };
    replies: {
      count: number;
    };
    mentioned_profiles: Array<{
      object: string;
      fid: number;
      custody_address: string;
      username: string;
      display_name: string;
      pfp_url: string;
      profile: {
        bio: {
          text: string;
          mentioned_profiles: unknown[];
        };
      };
      follower_count: number;
      following_count: number;
      verifications: string[];
      active_status: string;
    }>;
    viewer_context: {
      liked: boolean;
      recasted: boolean;
    };
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
      console.log("Received webhook data:", hookData);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error('Invalid JSON in request body');
    }

    // Validate the structure of hookData
    if (!hookData.cast || typeof hookData.cast.hash !== 'string' || typeof hookData.cast.text !== 'string') {
      throw new Error('Invalid structure for WebhookData');
    }

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
        text: hookData.cast.text,
        type: 'STORY',
        hash: hookData.cast.hash
      }),
    });

    if (!llmResponse.ok) {
      throw new Error('Failed to process story with LLM');
    }

    const llmResult = await llmResponse.json() as LLMResponse;

    console.log('LLM Result:', llmResult);

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