import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import FeedCard from "../../../../components/shared/story-card";
import { Story  } from "@/types";
import {InfiniteScrollFeed} from "./feed-infinite"; // We'll create this next

interface FeedListProps {
  initialStories: Story[];
  searchParams: Record<string, string | string[] | undefined>; 
  initialCursor : string | null
}

const FeedList = ({ initialStories, searchParams , initialCursor }: FeedListProps) => {
  return (
    <ScrollArea className="flex  flex-col">
      <div className="flex flex-col">
        <InfiniteScrollFeed initialStories={initialStories} searchParams={searchParams} initialCursor={initialCursor} />
      </div>
    </ScrollArea>
  );
};

export default FeedList;