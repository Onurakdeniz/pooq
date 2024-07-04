import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { authMiddleware, AuthMiddlewareResult } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

interface RequestBody {
  storyId: string;
  userAddress: string;
  timestamp: number;
  signature: string;
}

function isValidRequestBody(body: unknown): body is RequestBody {
  console.log('Validating request body:', body);
  const isValid = (
    typeof body === 'object' &&
    body !== null &&
    'storyId' in body &&
    typeof (body as RequestBody).storyId === 'string' &&
    'userAddress' in body &&
    typeof (body as RequestBody).userAddress === 'string' &&
    'timestamp' in body &&
    typeof (body as RequestBody).timestamp === 'number' &&
    'signature' in body &&
    typeof (body as RequestBody).signature === 'string'
  );
  console.log('Request body is valid:', isValid);
  return isValid;
}

export async function POST(request: NextRequest) {
  console.log('POST request received');
  try {
    console.log('Running authentication middleware');
    const authResult: AuthMiddlewareResult = await authMiddleware(request);
    if (!authResult || authResult instanceof NextResponse) {
      console.log('Authentication failed:', authResult);
      return authResult ?? NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = authResult;
    console.log('Authenticated user:', currentUser);

    console.log('Parsing request body');
    const rawBody: unknown = await request.json();
    if (!isValidRequestBody(rawBody)) {
      console.log('Invalid request body:', rawBody);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const body: RequestBody = rawBody;
    const { storyId, userAddress } = body;
    console.log('Parsed request body:', { storyId, userAddress });

    // TODO: Implement custom signature verification here
    console.log('Signature verification skipped. Implement custom verification method.');

    console.log('Fetching story from database');
    const story = await prisma.story.findUnique({
      where: { id: parseInt(storyId, 10) },
    });

    if (!story) {
      console.log('Story not found:', storyId);
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }
    console.log('Story found:', story);

    console.log('Checking if bookmark already exists');
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_storyId: {
          userId: currentUser.id,
          storyId: story.id,
        },
      },
    });

    if (existingBookmark) {
      console.log('Deleting existing bookmark');
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      });
      console.log('Bookmark deleted');
      return NextResponse.json({ success: true, action: 'deleted' }, { status: 200 });
    } else {
      console.log('Creating new bookmark');
      const bookmark = await prisma.bookmark.create({
        data: {
          userId: currentUser.id,
          storyId: story.id,
        },
      });
      console.log('Bookmark created:', bookmark);
      return NextResponse.json({ success: true, action: 'created', bookmark }, { status: 200 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}