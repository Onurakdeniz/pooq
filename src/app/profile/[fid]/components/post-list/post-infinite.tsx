"use client";

import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/trpc/react";
import { PostWithStory } from "@/types/type";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { ProfilePost } from "@/components/shared/post-card";
import InfiniteScroll from "react-infinite-scroll-component";
import ConnectWalletDialog from "@/components/wallet";
import { useParams } from "next/navigation";

interface InfiniteScrollPostListProps {
  initialPosts: PostWithStory[];
  searchParams: Record<string, string | string[] | undefined>;
  initialCursor: string | null;
}

const SkeletonPostCard: React.FC = () => (
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

export const InfiniteScrollPostList: React.FC<InfiniteScrollPostListProps> = ({
  initialPosts,
  searchParams,
  initialCursor,
}) => {
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

  const filterParam = searchParams.filters as string | undefined;
  const tags = filterParam ? filterParam.split(",") : [];
  const { fid } = useParams();
  const userFid = parseInt(fid as string);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    api.story.getPostsWithStoryByUser.useInfiniteQuery(
      {
        userFid,
        limit: 10,
        // Add any other query parameters here
      },
      {
        getNextPageParam: (lastPage) =>
          lastPage.nextCursor ? lastPage.nextCursor : undefined,
        initialData: {
          pages: [
            {
              items: initialPosts,
              nextCursor: initialCursor ? initialCursor : null,
            },
          ],
          pageParams: [undefined],
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
      },
    );

  const allPosts = React.useMemo(() => {
    return data ? data.pages.flatMap((page) => page.items) : initialPosts;
  }, [data, initialPosts]);

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
          <SkeletonPostCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <>
      <InfiniteScroll
        dataLength={allPosts.length}
        next={loadMore}
        hasMore={!!hasNextPage}
        loader={<SkeletonPostCard />}
      
      >
        {allPosts.map((post) => (
          <ProfilePost
            key={post.id}
            id={post.id}
            storyId={post.storyId}
            storyTitle={post.storyTitle}
            text={post.text}
            author={post.author}
            cast={post.cast}
          />
        ))}
      </InfiniteScroll>
      <ConnectWalletDialog open={showDialog} onOpenChange={handleDialogClose} />
    </>
  );
};
