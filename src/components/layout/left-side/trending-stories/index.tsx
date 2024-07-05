import React from "react";
import { TrendingItem } from "@/types/type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/trpc/server";
import { TrendingStoryItem } from "./item";

export const TrendingItemsList = async () => {
  const trendingStories = await api.story.getTrendingStories();
 
  return (
    <ScrollArea className="flex h-[600px]">
      <div className="flex flex-col gap-3 pr-4">
        {trendingStories.map((story, index) => (
          <TrendingStoryItem
            key={story.storyId}
            title={story.title.substring(0, 50)} // Assuming the first 50 characters as title
            storyId={story.storyId}
            numberofPosts={story.numberofPosts}
            authorFid={story.authorFid}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default TrendingItemsList;