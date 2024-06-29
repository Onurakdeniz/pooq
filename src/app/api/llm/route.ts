import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import type { CastFull } from '@/types';

// Define the structure of the LLM response
interface LLMResponse {
  success: boolean;
  data?: unknown; // Adjust based on actual structure
  error?: string;
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

    let hookData: CastFull;
    try {
      const parsedBody = JSON.parse(body) as {cast?: unknown; text?: unknown};
      // Type checking and ensuring that the parsed body matches the WebhookData structure
      if (
        parsedBody &&
        typeof parsedBody.cast === 'object' &&
        parsedBody.cast !== null &&
        typeof parsedBody.text === 'string'
      ) {
        hookData = parsedBody as CastFull;
      } else {
        throw new Error('Invalid structure for WebhookData');
      }
    } catch {
      throw new Error('Invalid JSON in request body');
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
        id: hookData.hash,
        text: hookData.text,
        type: 'STORY',
        hash: hookData.hash
      }),
    });

    if (!llmResponse.ok) {
      throw new Error('Failed to process story with LLM');
    }

    const llmResult = await llmResponse.json() as LLMResponse;

    console.log('llmResult', llmResult);

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