import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { Story, Post } from "@/types";
import { InfiniteScrollStoryList } from "./feed-infinite";

interface StoryListProps {
  initialStories: (Story & { posts: Post[] })[];
  searchParams: Record<string, string | string[] | undefined>;
  initialCursor: number | null;
  isProfile? :boolean
}

const StoryList = ({ initialStories, searchParams, initialCursor  , isProfile}: StoryListProps) => {
  return (
    <ScrollArea className="flex flex-col">
      <div className="flex flex-col">
        <InfiniteScrollStoryList
          initialStories={initialStories}
          searchParams={searchParams}
          initialCursor={initialCursor}
          isProfile={isProfile}
        />
      </div>
    </ScrollArea>
  );
};

export default StoryList;