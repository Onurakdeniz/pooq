import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { kv } from '@vercel/kv';

const prisma = new PrismaClient();

export interface TrendingItem {
  storyId: number;
  title: string;
  authorFid: number;
  numberOfPosts: number;
}

async function getTrendingStories(): Promise<TrendingItem[]> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const trendingStories = await prisma.story.findMany({
    where: {
      posts: {
        some: {
          createdAt: {
            gte: twentyFourHoursAgo
          }
        }
      }
    },
    include: {
      posts: {
        where: {
          createdAt: {
            gte: twentyFourHoursAgo
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

  const trendingItems: TrendingItem[] = trendingStories.map(story => ({
    storyId: story.id,
    title: story.extraction?.title ?? story.text.substring(0, 50) + '...', // Use extraction title if available, otherwise use truncated story text
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