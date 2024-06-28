import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

// Define the expected structure of the request body
interface RequestBody {
  userId?: string;
  text?: string;
  hash?: string;
}

// Define the structure of the LLM response
interface LLMResponse {
  success: boolean;
  data?: unknown; // Adjust based on actual structure
  error?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log("Processing request");

  try {
    // Explicitly typecast the request body
    const body: RequestBody = await req.json() as RequestBody;
    const { userId, text } = body;

    // Create dummy data for the story
    const dummyStory = {
      id: 'dummy-story-id-123',
      text: text ?? 'This is a dummy story text.', // Use nullish coalescing
      userId: userId ?? 'dummy-user-id-456', // Use nullish coalescing
    };

    // Define the Fleek Functions URL
    const fleekFunctionUrl = 'https://full-napkin-square.functions.on-fleek.app';
    
    // Perform the LLM request
    const llmResponse = await fetch(fleekFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: "12312312",
        text: "adasd asdasd asdas das dasdsa",
        type: "story",
        hash: 'dummy-hash-789'
      }),
    });

    if (!llmResponse.ok) {
      throw new Error('Failed to process story with LLM');
    }

    // Explicitly typecast the LLM response
    const llmResult: LLMResponse = await llmResponse.json() as LLMResponse;
    console.log("llmResult", llmResult);

    return NextResponse.json({
      success: true,
      storyId: dummyStory.id,
      llmResult,
    });
  } catch (error: unknown) {
    console.error('Error processing story:', error);

    // Ensure the error message is properly extracted
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
