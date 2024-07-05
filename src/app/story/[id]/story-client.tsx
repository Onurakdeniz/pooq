"use client";

import React, { useMemo } from "react";
import { api } from "@/trpc/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PostList } from "./components/post-list";
import StoryTop from "./components/story-top";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "@/server/api/root";
import { Post } from "@/types/type";
import StoryCard from "@/components/shared/story-card";
import { Skeleton } from "@/components/ui/skeleton";
import { GetStoryWithPostsOutputType} from "@/schemas/schema"

export default function StoryClient({ initialData, storyId } : {
    initialData : GetStoryWithPostsOutputType ,
    storyId : number
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.story.getStoryWithPosts.useInfiniteQuery(
      {
        storyId: storyId,
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialData: { pages: [initialData], pageParams: [undefined] },
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
          {story ? (
            <StoryCard
              key={story.id}
              hash={story.hash}
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
        <PostList
          posts={posts}
          isLoading={false}
          error={null}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </ScrollArea>
    </div>
  );
}
