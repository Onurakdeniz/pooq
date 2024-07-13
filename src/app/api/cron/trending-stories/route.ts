import { PrismaClient, StoryType } from "@prisma/client";
import { kv } from "@vercel/kv";
import { TrendingItem, Author } from "@/types";
import { fetchNeynarUsers } from "@/server/api/lib/user";
import { NextResponse } from "next/server";

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

  // Get the first 10 stories
  return shuffledStories.slice(0, 10);
}

async function fetchAuthorData(fid: number): Promise<Author> {
  const neynarData = await fetchNeynarUsers([fid]);
  if (!neynarData?.users || neynarData.users.length === 0) {
    throw new Error(`Failed to fetch data from Neynar API for FID: ${fid}`);
  }

  const neynarUser = neynarData.users[0];
  if (!neynarUser) {
    throw new Error(`Neynar user data is undefined for FID: ${fid}`);
  }

  const [storyCount, postCount] = await Promise.all([
    prisma.story.count({ where: { authorId: fid } }),
    prisma.post.count({ where: { authorId: fid } }),
  ]);

  return {
    numberOfStories: storyCount,
    numberOfPosts: postCount,
    username: neynarUser.username,
    isUser: false,
    fid: neynarUser.fid,
    isRegistered: true,
    custodyAddress: neynarUser.custody_address,
    displayName: neynarUser.display_name,
    pfpUrl: neynarUser.pfp_url,
    followerCount: neynarUser.follower_count,
    followingCount: neynarUser.following_count,
    verifications: neynarUser.verifications,
    activeStatus: neynarUser.active_status,
    powerBadge: neynarUser.power_badge,
    viewerContent: neynarUser.viewer_context,
    bio: neynarUser.profile.bio.text,
  };
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j] as T, shuffled[i] as T];
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
    take: 2,
  });

  return Promise.all(promotedStories.map(async (story) => {
    const author = await fetchAuthorData(story.author.fid);
    return {
      storyId: story.id,
      title: story.extraction?.title ?? "",
      author,
      numberOfPosts: 0,
      type: story.extraction?.type ?? null,
      isPromoted: true,
    };
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

  const trendingItems = await Promise.all(stories.map(async (story) => {
    const author = await fetchAuthorData(story.author.fid);
    return {
      storyId: story.id,
      title: story.extraction?.title ?? "",
      author,
      numberOfPosts: story.posts.length,
      type: story.extraction?.type ?? null,
    };
  }));

  return trendingItems.sort((a, b) => b.numberOfPosts - a.numberOfPosts);
}

async function storeTrendingStories(stories: TrendingItem[]): Promise<void> {
  await kv.set("trendingStories", JSON.stringify(stories));
  await kv.set("lastUpdated", new Date().toISOString());
}

export async function GET(request: Request) {
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