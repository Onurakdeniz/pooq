import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import FeedCard from "../../../../components/shared/story-card";
import { Story } from "@/types";
import { InfiniteScrollStoryList } from "./feed-infinite";

interface StoryListProps {
  initialStories: Story[];
  searchParams: Record<string, string | string[] | undefined>;
  initialCursor: number | null;
}

  const StoryList = ({ initialStories, searchParams, initialCursor }: StoryListProps) => {
  

  return (
    <ScrollArea className="flex flex-col">
      <div className="flex flex-col">
        <InfiniteScrollStoryList
          initialStories={initialStories}
          searchParams={searchParams}
          initialCursor={initialCursor}
        />
      </div>
    </ScrollArea>
  );
};

export default StoryList
 