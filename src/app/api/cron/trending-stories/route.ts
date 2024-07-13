import { NextResponse } from "next/server";
import { PrismaClient, StoryType } from "@prisma/client";
import { kv } from "@vercel/kv";
import {TrendingItem} from "@/types"

const prisma = new PrismaClient();



async function getTrendingStories(): Promise<TrendingItem[]> {
  const now = new Date();
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Get promoted stories
  const promotedStories = await getPromotedStories();

  // Get trending stories
  let trendingStories = await fetchStoriesWithPosts(fortyEightHoursAgo);

  if (trendingStories.length < 10) {
    const additionalStories = await fetchStoriesWithPosts(
      sevenDaysAgo,
      fortyEightHoursAgo,
    );
    trendingStories = [...trendingStories, ...additionalStories];
  }

  // Merge promoted and trending stories
  const mergedStories = [...promotedStories, ...trendingStories];

  // Shuffle the merged stories to distribute promoted stories
  const shuffledStories = shuffleArray(mergedStories);

  // Return the first 10 stories
  return shuffledStories.slice(0, 10);
}
 
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i] as T;
    shuffled[i] = shuffled[j] as T;
    shuffled[j] = temp;
  }
  return shuffled;
}
async function getPromotedStories(): Promise<TrendingItem[]> {
  const promotedStories = await prisma.story.findMany({
    where: {
      isPromoted: true, 
    },
    include: {
      author: {
        select: { fid: true },
      },
      extraction: {
        select: { title: true, type: true },
      },
    },
    take: 2
  });

  return promotedStories.map((story) => ({
    storyId: story.id,
    title: story.extraction?.title ?? '',
    authorFid: story.author.fid,
    numberOfPosts: 0,  
    type: story.extraction?.type ?? null,
    isPromoted: true,  
  }));
}

async function fetchStoriesWithPosts(
  startDate: Date,
  endDate?: Date,
): Promise<TrendingItem[]> {
  const stories = await prisma.story.findMany({
    where: {
      isPromoted: false,  
      posts: {
        some: {
          createdAt: {
            gte: startDate,
            ...(endDate && { lt: endDate }),
          },
        },
      },
    },
    include: {
      posts: {
        where: {
          createdAt: {
            gte: startDate,
            ...(endDate && { lt: endDate }),
          },
        },
        select: { id: true },
      },
      author: {
        select: { fid: true },
      },
      extraction: {
        select: { title: true, type: true },
      },
    },
  });

  const trendingItems: TrendingItem[] = stories.map((story) => ({
    storyId: story.id,
    title: story.extraction?.title ?? '',   
    authorFid: story.author.fid,
    numberOfPosts: story.posts.length,
    type: story.extraction?.type ?? null,  
  }));

  trendingItems.sort((a, b) => b.numberOfPosts - a.numberOfPosts);

  return trendingItems;
}

async function storeTrendingStories(stories: TrendingItem[]): Promise<void> {
  await kv.set("trendingStories", JSON.stringify(stories));
  await kv.set("lastUpdated", new Date().toISOString());
}

export async function GET(request: Request) {
  // Verify the request is coming from Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const trendingStories = await getTrendingStories();
    await storeTrendingStories(trendingStories);

    return NextResponse.json({
      success: true,
      message: "Trending stories updated",
    });
  } catch (error) {
    console.error("Error in trending stories cron job:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}