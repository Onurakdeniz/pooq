import React from "react";
import FeedActions from "./actions";
import { LLMForm } from "./llm";

const FeedTop = () => {
  return (
    <div className="flex flex-col sticky top-0 z-40 text-primary bg-[#fffdf5] dark:bg-[#1a1a1a] transition-colors duration-200">
      <div className="flex h-16 w-full items-center justify-between border-b px-8">
        <div className="text-2xl font-light">Latest Stories</div>
        <FeedActions />
      </div>
      <LLMForm />
    </div>
  );
};

export default FeedTop;