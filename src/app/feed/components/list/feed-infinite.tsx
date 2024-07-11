"use client";

import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/trpc/react";
import { Story } from "@/types/";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import StoryCard from "@/components/shared/story-card";
import InfiniteScroll from "react-infinite-scroll-component";
import ConnectWalletDialog from "@/components/wallet";

interface InfiniteScrollStoryListProps {
  initialStories: Story[];
  searchParams: Record<string, string | string[] | undefined>;
  initialCursor: string | null;
}

const SkeletonStoryCard: React.FC = () => (
  <div className="space-y-4 rounded-lg p-6 shadow-sm">
    <div className="flex items-center space-x-2">
      <Skeleton className="h-10 w-10 rounded-full" />
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

export const InfiniteScrollStoryList: React.FC<
  InfiniteScrollStoryListProps
> = ({ initialStories, searchParams, initialCursor }) => {
  const [isClient, setIsClient] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState(false);
  const searchParamsHook = useSearchParams();

  useEffect(() => {
    setIsClient(true);
    if (searchParamsHook.get("showDialog") === "true") {
      setShowDialog(true);
    }
  }, [searchParamsHook]);

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  const categoryFilters = searchParams.filters
    ? (searchParams.filters as string).split(",")
    : undefined;
  const llmMode = searchParams.llmMode === "true";
  const tagName = searchParams.tag as string | undefined;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    api.story.getStories.useInfiniteQuery(
      {
        limit: 10,
        categoryFilters,
        llmMode,
        tagName,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        initialData: {
          pages: [{ items: initialStories, nextCursor: initialCursor }],
          pageParams: [undefined],
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
      },
    );

    const useAllStories = (data: { pages: { items: Story[] }[] } | undefined, initialStories: Story[]): Story[] => {
      return React.useMemo(() => {
        return data ? data.pages.flatMap((page) => page.items) : initialStories;
      }, [data, initialStories]);
    };

    const allStories = useAllStories(data, initialStories);
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
>
  {allStories.map((story: Story) => (
    <StoryCard
      key={story.id}
      id={story.id}
      cardType="FEED"
      author={story.author}
      timestamp={story.timestamp}
      entities={story.entities}
      isBookmarkedByUserId={story.isBookmarkedByUserId}
      title={story.title}
      tags={story.tags}
      numberOfPosts={story.numberOfPosts}
      categories={story.categories}
      view={story.view}
      description={story.description}
      type={story.type}
      hash={story.hash}  
      text={story.text}  
      isLikedBuUserFid={story.isLikedBuUserFid}  
      numberOfLikes={story.numberOfLikes}  
    />
  ))}
</InfiniteScroll>
      <ConnectWalletDialog open={showDialog} onOpenChange={handleDialogClose} />
    </>
  );
};
