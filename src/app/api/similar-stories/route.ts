import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface PineconeMatch {
  id: string;
  score: number;
  values?: number[];
  metadata?: Record<string, unknown>;
}

interface FleekResponse {
  message: string;
  results: PineconeMatch[];
}

interface RequestBody {
  storyId: string;
}

interface Story {
  id: number;
  hash: string;
  text: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json() as RequestBody;
    const { storyId } = body;
    console.log("storyidapi", storyId);

    if (!storyId) {
      return NextResponse.json(
        { message: "Story ID is required" },
        { status: 400 },
      );
    }

    // Find the hash for the given story ID
    const story = await prisma.story.findUnique({
      where: { id: parseInt(storyId, 10) },
      select: { hash: true },
    });

    if (!story) {
      return NextResponse.json({ message: "Story not found" }, { status: 404 });
    }

    console.log("storyhash", story.hash);
    // Send request to Fleek function
   
    const fleekResponse = await fetch(
      "https://acoustic-zoo-little.functions.on-fleek.app",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          hash: story.hash,  
          topK: 5   
        }),
      }
    );
    
    if (!fleekResponse.ok) {
      throw new Error("Failed to fetch similar stories");
    }
    
    const fleekData: FleekResponse = await fleekResponse.json() as FleekResponse;
    const { results } = fleekData;
    
    // Process the results
    const similarStoryHashes: string[] = results.map((match: PineconeMatch) => match.id);
    // Fetch stories from database based on similar hashes
    const similarStories: Story[] = await prisma.story.findMany({
      where: {
        hash: { in: similarStoryHashes },
      },
      select: {
        id: true,
        hash: true,
        text: true,
      },
    });

    return NextResponse.json({
      message: "Successfully fetched similar stories",
      similarStories,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}