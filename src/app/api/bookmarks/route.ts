import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { PrismaClient, Prisma } from '@prisma/client';
import { authMiddleware, AuthMiddlewareResult } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

interface RequestBody {
  storyId: string;
  userAddress: string;
  timestamp: string;
  signature: string;
}

function isValidRequestBody(body: unknown): body is RequestBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    'storyId' in body &&
    'userAddress' in body &&
    'timestamp' in body &&
    'signature' in body &&
    typeof (body as RequestBody).storyId === 'string' &&
    typeof (body as RequestBody).userAddress === 'string' &&
    typeof (body as RequestBody).timestamp === 'string' &&
    typeof (body as RequestBody).signature === 'string'
  );
}

export async function POST(request: NextRequest) {
  try {
    // First, run the authentication middleware
    const authResult: AuthMiddlewareResult = await authMiddleware(request);
    if (!authResult || authResult instanceof NextResponse) {
      return authResult ?? NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = authResult;

    const rawBody: unknown = await request.json();
    if (!isValidRequestBody(rawBody)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const body: RequestBody = rawBody;
    const { storyId, userAddress, timestamp, signature } = body;

    console.log('Received request body:', body);

    const message = `Bookmark Story Id ${storyId} at ${timestamp} timestamp`;

    const signerAddress = ethers.verifyMessage(message, signature);

    if (signerAddress.toLowerCase() !== userAddress.toLowerCase()) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const story = await prisma.story.findUnique({
      where: { id: parseInt(storyId, 10) },
    });

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: currentUser.id,
        storyId: story.id,
      },
    });

    console.log('Bookmark saved:', bookmark);

    return NextResponse.json({ success: true, bookmark }, { status: 200 });
  } catch (error) {
    console.error('Error saving bookmark:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ error: 'Bookmark already exists' }, { status: 409 });
      }
    }
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}