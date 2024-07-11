import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { kv } from '@vercel/kv';

const prisma = new PrismaClient();

export interface TrendingItem {
  storyId: string;
  title: string;
  authorFid: number;
  numberOfPosts: number;
}

async function getTrendingStories(): Promise<TrendingItem[]> {
  const now = new Date();
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // First, get stories with posts from the last 48 hours
  let trendingStories = await fetchStoriesWithPosts(fortyEightHoursAgo);

  // If we don't have 10 stories, fetch more from the last 7 days
  if (trendingStories.length < 10) {
    const additionalStories = await fetchStoriesWithPosts(sevenDaysAgo, fortyEightHoursAgo);
    trendingStories = [...trendingStories, ...additionalStories].slice(0, 10);
  }

  return trendingStories;
}

async function fetchStoriesWithPosts(startDate: Date, endDate?: Date): Promise<TrendingItem[]> {
  const stories = await prisma.story.findMany({
    where: {
      posts: {
        some: {
          createdAt: {
            gte: startDate,
            ...(endDate && { lt: endDate }),
          }
        }
      }
    },
    include: {
      posts: {
        where: {
          createdAt: {
            gte: startDate,
            ...(endDate && { lt: endDate }),
          }
        },
        select: { id: true }
      },
      author: {
        select: { fid: true }
      },
      extraction: {
        select: { title: true }
      }
    }
  });

  const trendingItems: TrendingItem[] = stories.map(story => ({
    storyId: story.id,
    title: story.extraction?.title ?? story.text.substring(0, 50) + '...',
    authorFid: story.author.fid,
    numberOfPosts: story.posts.length
  }));

  trendingItems.sort((a, b) => b.numberOfPosts - a.numberOfPosts);

  return trendingItems;
}

async function storeTrendingStories(stories: TrendingItem[]): Promise<void> {
  await kv.set('trendingStories', JSON.stringify(stories));
  await kv.set('lastUpdated', new Date().toISOString());
}

export async function GET(request: Request) {
  // Verify the request is coming from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const trendingStories = await getTrendingStories();
    await storeTrendingStories(trendingStories);

    return NextResponse.json({ success: true, message: 'Trending stories updated' });
  } catch (error) {
    console.error('Error in trending stories cron job:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}