import React from "react";
import { TrendingItem } from "@/types/type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/trpc/server";
import { TrendingStoryItem } from "./item";

export const TrendingItemsList = async () => {
  const trendingStories = await api.story.getTrendingStories();
  console.log("trending", trendingStories);
  return (
    <div className="flex flex-col gap-2">
      <div className="font-semibold text-base">Trending Stories</div>
      <ScrollArea className="flex h-[600px]">
        <div className="flex flex-col gap-3 pr-4">
          {trendingStories.map((story, index) => (
            <TrendingStoryItem
              key={story.storyId}
              title={story.title.substring(0, 50)}
              storyId={story.storyId}
              numberOfPosts={story.numberOfPosts}
              authorFid={story.authorFid}
            />
          ))}
        </div>
      </ScrollArea>{" "}
    </div>
  );
};

export default TrendingItemsList;
