// app/feed/page.tsx

import { Suspense } from 'react';
import { api } from "@/trpc/server";
import StoryList from './components/list';
import FeedTop from './components/top';
import { Story } from "@/types/type";

interface APIResponse {
  items: Story[];
  nextCursor: string | null;
}

export default async function FeedPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const limit = 10;
  const cursor = searchParams.cursor as string | undefined;
  const userId = searchParams.userId ? parseInt(searchParams.userId as string) : undefined;
  const fid = searchParams.fid ? parseInt(searchParams.fid as string) : undefined;

  try {
    const apiResponse = await api.story.getStories({
      limit,
      cursor,
      userId,
      fid,
    });

    const initialStories:  Story[] = apiResponse.items;

    return (
      <div className='flex flex-col min-h-screen z-0'>
        <FeedTop />
        <Suspense fallback={<div>Loading stories...</div>}>
          <StoryList 
            initialStories={initialStories} 
            searchParams={searchParams} 
            initialCursor={apiResponse.nextCursor}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error fetching stories:", error);
    return <div>Error loading stories. Please try again later.</div>;
  }
}