import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { kv } from '@vercel/kv';

const prisma = new PrismaClient();

async function getTrendingStories() {
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
        select: { id: true } // Only select the id to reduce data transfer
      },
      author: {
        select: { userName: true, fid: true } // Select only necessary fields
      }
    }
  });

  const storiesWithPostCount = trendingStories.map(story => ({
    id: story.id,
    hash: story.hash,
    text: story.text,
    authorName: story.author.userName,
    authorId: story.author.fid,
    postCount: story.posts.length,
    createdAt: story.createdAt,
    updatedAt: story.updatedAt
  }));

  storiesWithPostCount.sort((a, b) => b.postCount - a.postCount);

  return storiesWithPostCount;


}
interface Story {
  id: number;  // Changed from string to number
  hash: string;
  text: string;
  authorName: string;
  authorId: number;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}
async function storeTrendingStories(stories: Story[]): Promise<void> {
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