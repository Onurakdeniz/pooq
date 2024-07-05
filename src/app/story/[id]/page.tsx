"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PostList } from "./components/post-list";
import StoryTop from "./components/story-top";
import StoryHeader from "./components/header";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "@/server/api/root";
import { Post } from "@/types/type";
import StoryCard from "@/components/shared/story-card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrivy } from "@privy-io/react-auth";

export default function Story() {
  const { id } = useParams();
  const storyId = Number(id);

  const { user } = usePrivy();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.story.getStoryWithPosts.useInfiniteQuery(
    {
      storyId: storyId,
      userId: user?.id,
      fid: user?.farcaster?.fid,
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!storyId,
      staleTime: 1000 * 60 * 5,
    },
  );

  const posts = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.posts as unknown as Post[]);
  }, [data]);

  const story = data?.pages[0]?.story;

  return (
    <div className="z-0 flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col">
        <StoryTop />
        <div className="flex flex-col">
          {isLoading ? (
            <StoryCardSkeleton />
          ) : story ? (
            <StoryCard
              key={story.id}
              id={story.id}
              type={"STORY"}
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
          ) : null}
          <div className="border-b"></div>
        </div>
      </div>
      <ScrollArea className="flex-1">
        {isLoading ? (
          <PostListSkeleton />
        ) : (
          <PostList
            posts={posts}
            isLoading={isLoading}
            error={error as TRPCClientErrorLike<AppRouter> | null}
            hasNextPage={hasNextPage ?? false}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        )}
      </ScrollArea>
    </div>
  );
}

function StoryCardSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}

function PostListSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </div>
      ))}
    </div>
  );
}
