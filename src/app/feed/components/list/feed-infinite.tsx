"use client";

import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/trpc/react";
import Link from "next/link";
import { Story as IStory } from "@/types/type";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from 'next/navigation';
import StoryCard from "@/components/shared/story-card";
import InfiniteScroll from "react-infinite-scroll-component";
import ConnectWalletDialog from '@/components/wallet';

interface InfiniteScrollStoryListProps {
  initialStories: IStory[];
  searchParams: Record<string, string | string[] | undefined>;
  initialCursor: string | null;
}

const SkeletonStoryCard: React.FC = () => (
  <div className="p-6 space-y-4 rounded-lg shadow-sm">
    <div className="flex items-center space-x-2">
      <Skeleton className="w-10 h-10 rounded-full" />
      <Skeleton className="h-4 w-1/4" />
    </div>
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex space-x-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-16" />
    </div>
  </div>
);

export const InfiniteScrollStoryList: React.FC<InfiniteScrollStoryListProps> = ({
  initialStories,
  searchParams,
  initialCursor,
}) => {
  const [isClient, setIsClient] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState(false);
  const searchParamsHook = useSearchParams();

  useEffect(() => {
    setIsClient(true);
    if (searchParamsHook.get('showDialog') === 'true') {
      setShowDialog(true);
    }
  }, [searchParamsHook]);

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  const filterParam = searchParams.filters as string | undefined;
  const tags = filterParam ? filterParam.split(",") : [];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    api.story.getStories.useInfiniteQuery(
      {
        limit: 10,
        // Add any other query parameters here
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

  const loadMore = React.useCallback(async () => {
    if (hasNextPage && !isFetchingNextPage) {
      try {
        await fetchNextPage();
      } catch (error) {
        console.error("Failed to fetch next page:", error);
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (!isClient || isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonStoryCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <>
      <InfiniteScroll
        dataLength={allStories.length}
        next={loadMore}
        hasMore={!!hasNextPage}
        loader={<SkeletonStoryCard />}
        endMessage={<div className="flex justify-center text-sm p-2 text-primary/60">No more stories to load.</div>}
      >
        {allStories.map((story) => (
          <Link href={`/story/${story.id}`} key={story.id}>
            <StoryCard
              id={story.id}
              type={story.type}
              author={story.author}
              cast={story.cast}
              entities={story.entities}
              mentionedStories={story.mentionedStories}
              isBookmarked={story.isBookmarked}
              title={story.title}
              tags={story.tags}
              numberofPosts={story.numberofPosts}
              categories={story.categories}
            />
          </Link>
        ))}
      </InfiniteScroll>
      <ConnectWalletDialog 
        open={showDialog} 
        onOpenChange={handleDialogClose} 
      />
    </>
  );
};