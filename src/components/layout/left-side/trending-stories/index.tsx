import { TrendingUp } from "lucide-react";
import React from "react";
import TrendingItemsList from "./list";

const TrendingStories = () => {
  return (
    <div className="flex flex-col gap-2 px-2  ">
      <div className="flex gap-2 pb-2 text-primary/80 items-center text-lg ">
        <TrendingUp className="h-5 w-5" />
        <span className="">Trending Stories </span>
      </div>

      <TrendingItemsList />
    </div>
  );
};

export default TrendingStories;
