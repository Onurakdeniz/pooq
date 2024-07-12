'use server'

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

interface SimilarStory {
  id: number;
  title: string  
}

export async function getSimilarStories(
  storyId: number
): Promise<SimilarStory[]> {
  try {
    console.log("storyidapi", storyId);

    if (!storyId) {
      throw new Error("Story ID is required");
    }

    // Find the hash for the given story ID
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { hash: true },
    });

    if (!story) {
      throw new Error("Story not found");
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
          type: "STORY",
          topK: 5,
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
 
        extraction: {
          select: {
            title: true,
          },
        },
      },
    });

    // Map the data to return a flattened structure
    return similarStoriesData.map(story => ({
      id: story.id,
 
      title: story.extraction?.title ?? 'Untitled Story',
    }));
  } catch (error) {
    console.error("Error fetching similar stories:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}