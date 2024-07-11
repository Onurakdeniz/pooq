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
      where: { id: storyId },
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
          type: "POST",  // Add this line to specify the type
          topK: 5   
        }),
      }
    );

    console.log("Fleek function response status:", fleekResponse.status);

    if (!fleekResponse.ok) {
      const errorText = await fleekResponse.text();
      console.error('Fleek function error:', errorText);
      throw new Error(`Fleek function returned ${fleekResponse.status}: ${errorText}`);
    }
     
     /* eslint-disable */
    const fleekData: { code: number; headers: Record<string, string>; body: string } = await fleekResponse.json();
    console.log("Fleek function response data:", fleekData);
     /* eslint-disable */
    // Parse the body of the Fleek response
    const parsedBody = JSON.parse(fleekData.body) as FleekResponse;
    
    // Process the results
    const similarStoryHashes: string[] = parsedBody.results
      .map((match: PineconeMatch) => match.id)
      .filter(hash => hash !== story.hash);  // Exclude the original story hash
    
    // Fetch stories from database based on similar hashes
    const similarStoriesData = await prisma.story.findMany({
      where: {
        hash: { in: similarStoryHashes },
      },
      select: {
        id: true,
        hash: true,
        extraction: {
          select: {
            title: true,
          },
        },
      },
    });
    
    // Map the data to return a flattened structure
    const similarStories = similarStoriesData.map(story => ({
      id: story.id,
      hash: story.hash,
      title: story.extraction?.title ?? null, // Use null if extraction is not present
    }));
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