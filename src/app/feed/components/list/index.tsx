import { ScrollArea } from "@/components/ui/scroll-area";
import React, { Suspense } from "react";
import FeedCard from "../../../../components/shared/story-card";
import { api } from "@/trpc/server";

const stories = await api.story.getStories({});
console.log("stories", stories);

const FeedList = () => {
  return (
    <ScrollArea className="flex h-screen flex-col     ">
      <div className="flex flex-col   ">
        <Suspense>
          {stories.map((story) => (
            <FeedCard {...story} key={story.id} />
          ))}
        </Suspense>
      </div>
    </ScrollArea>
  );
};

export default FeedList;
