"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/trpc/react";
import StoryCard from "@/components/shared/story-card";
import { Story as IStory } from "@/types";
import InfiniteScroll from "react-infinite-scroll-component";

interface InfiniteScrollStoryListProps {
  initialStories: IStory[];  
  searchParams: Record<string, string | string[] | undefined>;
  initialCursor: string | null;
}

export const InfiniteScrollStoryList: React.FC<InfiniteScrollStoryListProps> = ({
  initialStories,
  searchParams,
  initialCursor,
}) => {
  const filterParam = searchParams.filters as string | undefined;
  const tags = filterParam ? filterParam.split(",") : [];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.story.getStories.useInfiniteQuery(
      {
        limit: 10,
 
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        initialData: {
          pages: [{ items: initialStories, nextCursor: initialCursor }],
          pageParams: [undefined],
        },
      }
    );

  const allStories = React.useMemo(() => {
    return data ? data.pages.flatMap((page) => page.items) : initialStories;
  }, [data, initialStories]);

  const loadMore = async () => {
    if (hasNextPage && !isFetchingNextPage) {
      try {
        await fetchNextPage();
      } catch (error) {
        console.error("Failed to fetch next page:", error);
      }
    }
  };

  return (
    <InfiniteScroll
      dataLength={allStories.length}
      next={loadMore}
      hasMore={!!hasNextPage}
      loader={<div>Loading more...</div>}
      endMessage={<div>No more stories to load.</div>}
    >
      {allStories.map((story) => (
        <StoryCard
          key={story.id}
          id={story.id}
          author={story.author}
          cast={story.cast}
          entities={story.entities}
          mentionedStories={story.mentionedStories}
          isBookmarked={story.isBookmarked}
          title={story.title}
          tags={story.tags}
        />
      ))}
    </InfiniteScroll>
  );
};