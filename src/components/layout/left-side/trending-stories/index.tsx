import React from "react";
import { TrendingItem } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/trpc/server";
import { TrendingStoryItem } from "./item";
import { TrendingUp } from "lucide-react";

export const TrendingItemsList = async () => {
  const trendingStories = await api.story.getTrendingStories();
  console.log("trending", trendingStories);
  return (
    <div className="flex flex-col gap-2 pt-4 px-2">
      <div className="font-semibold text-base flex gap-4 items-center">
        <TrendingUp size={"20"} />
        <span> Trending</span>
      </div>
      <ScrollArea className="flex h-[600px]">
        <div className="flex flex-col gap-3 pr-4">
          {trendingStories.map((story: TrendingItem, index) => (
            <TrendingStoryItem
              key={story.storyId}
              title={story.title?.substring(0, 50) ?? "Untitled"} // Add a fallback value
              storyId={story.storyId}
              numberOfPosts={story.numberOfPosts}
              author={story.author}
              type={story.type}
              isPromoted={story.isPromoted}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TrendingItemsList;