import { Suspense } from 'react';
import { api } from "@/trpc/server";
import { Entity } from "@/types/index";
import FeedFilter from './components/top/filter';
import FeedList from './components/list';
import FeedTop from './components/top';
import { Story  } from "@/types"
// Update the APIStory interface to make author and cast optional
 

interface APIResponse {
  items: Story[];
  nextCursor: string | null;
}

export default async function FeedPage({ searchParams }: {    searchParams: Record<string, string | string[] | undefined> }) {
  const filterParam = searchParams.filters as string | undefined;
  const tags = filterParam ? filterParam.split(',') : [];

  let apiResponse: APIResponse;
  try {
    if (tags.length > 0) {
      apiResponse = await api.story.getStoriesByTags({ tags, limit: 10 });
    } else {
      apiResponse = await api.story.getStories({ limit: 10 });
    }

    // Map the API stories to your Story type
    const initialStories: Story[] = apiResponse.items.map(apiStory => ({
      ...apiStory,
      entities: apiStory.entities.map(e => ({ ...e, entity: e.name })) as Entity[],
      author: apiStory.author || { id: '', name: 'Unknown Author' }, // Provide a default author if it's missing
      cast: apiStory.cast || {}, // Provide an empty object if cast is missing
    }));

    return (
      <div className='flex flex-col min-h-screen z-0  '>
        <FeedTop />
        <Suspense fallback={<div>Loading stories...</div>}>
          <FeedList 
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