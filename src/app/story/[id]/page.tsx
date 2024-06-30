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

export default function Story() {
  const { id: storyId } = useParams();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.story.getStoryWithPosts.useInfiniteQuery(
    {
      storyId: storyId as string,
      userId: 1,
      fid: 367559,
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!storyId,
    },
  );

  const posts = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.posts as unknown as Post[]);
  }, [data]);

  const story = data?.pages[0]?.story;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col">
        <StoryTop />
        <div className="flex flex-col">
          {story && (
            <StoryCard
              key={story.id}
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
          )}
          <div className="border-b"></div>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <PostList
          posts={posts}
          isLoading={isLoading}
          error={error as TRPCClientErrorLike<AppRouter> | null}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </ScrollArea>
    </div>
  );
}
