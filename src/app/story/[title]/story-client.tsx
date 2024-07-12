"use client";

import React, { useMemo } from "react";
import { api } from "@/trpc/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PostList } from "./components/post-list";
import StoryTop from "./components/story-top";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "@/server/api/root";
import { Post, Tag } from "@/types";
import StoryCard from "@/components/shared/story-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getStoryWithPostsOutputSchema } from "@/schemas";
import { z } from "zod";
import { StoryType } from "@prisma/client";

type GetStoryWithPostsOutput = z.infer<typeof getStoryWithPostsOutputSchema>;

export default function StoryClient({
  initialData,
  title,
}: {
  initialData: GetStoryWithPostsOutput;
  title: string;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.story.getStoryWithPosts.useInfiniteQuery(
      {
        title: title,
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
    <div className=" flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col">
        <StoryTop />
        <div className="flex flex-col">
          {story ? (
            <StoryCard
              key={story.id}
              id={story.id}
              cardType={"STORY"}
              hash={story.hash}
              author={story.author}
              entities={story.entities}
              isBookmarkedByUserId={story.isBookmarkedByUserId}
              title={story.title}
              tags={story.tags as Tag[]}
              numberOfPosts={story.numberOfPosts}
              categories={story.categories}
              view={story.view}
              description={story.description}
              type={story.type }
              numberOfLikes={story.numberOfLikes ?? 0}
              text={story.text || ""} // Add this line
              timestamp={story.timestamp || new Date().toISOString()} 
              isLikedBuUserFid={story.isLikedBuUserFid || false} 
 
            />
          ) : null}
          <div className="border-b"></div>
        </div>
      </div>

      <PostList
        posts={posts}
        isLoading={false}
        error={null}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={() => fetchNextPage()}
      />
    </div>
  );
}
