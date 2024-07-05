import React from "react";
import { TrendingStoryItem } from "./item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/trpc/server";
 


export const TrendingItemsList = async () => {
  const ITEMS = await api.story.getTrendingStories();
 
  return (
    <ScrollArea
      className="flex h-[600px]   "
      
    >
      <div className="flex flex-col gap-3 pr-4 ">
        {ITEMS.map((item,index) => (
          <TrendingStoryItem
          key={index}
            title={item.title}
            storyId={item.storyId}
            numberofPosts={item.numberofPosts}
            authorFid={item.authorFid}
   
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default TrendingItemsList;


 

