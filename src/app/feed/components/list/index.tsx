import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import FeedCard from "../../../../components/shared/story-card";

const FeedList = () => {
  return (
    <ScrollArea className="flex h-screen flex-col     ">
      <div className="flex flex-col   ">
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
      </div>
    </ScrollArea>
  );
};

export default FeedList;
