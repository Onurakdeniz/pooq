import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from "@/lib/authMiddleware" // Adjust the import path as needed

const prisma = new PrismaClient();

interface RequestBody {
  text: string;
}

interface ExternalServiceResponse {
  tags: string[];
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authMiddleware(req);

    if (!authResult || authResult instanceof NextResponse) {
      // If authResult is undefined or a NextResponse, it means authentication failed
      return authResult ?? new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // At this point, authResult is the currentUser object
    const currentUser = authResult;

    // Get request body
    const body = await req.json() as RequestBody;
    const { text } = body;

    // Verify if user exists (existence in database implies registration)
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Store LLM feed in database
    const llmFeed = await prisma.lLMFeed.create({
      data: {
        text,
        userId: currentUser.id,
      },
    });

    // Get all tags from database
    const allTags = await prisma.tag.findMany({
      select: { name: true },
    });

    // Send request to external service
    const response = await fetch('https://your-external-service-url.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        tags: allTags.map(tag => tag.name),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get tags from external service');
    }

    const responseData = await response.json() as ExternalServiceResponse;
    const newTags = responseData.tags;

    // Save new tags to database and connect them to the LLMFeed
    const tagConnections = await Promise.all(newTags.map(async (tagName: string) => {
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      });
      return tag.id;
    }));

    await prisma.lLMFeed.update({
      where: { id: llmFeed.id },
      data: {
        tags: {
          connect: tagConnections.map(id => ({ id })),
        },
      },
    });

    return new NextResponse(JSON.stringify({ success: true, llmFeedId: llmFeed.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error in POST handler:', error);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}