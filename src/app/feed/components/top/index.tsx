import React from "react";
import FeedActions from "./actions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LLMForm } from "./llm";

const FeedTop = () => {
  return (
    <div className="flex flex-col sticky top-0 z-40 bg-accent ">
      <div className=" flex h-16 w-full items-center justify-between border-b  px-8">
        <div className="text-2xl font-light  ">Latest Stories</div>
        <FeedActions />
      </div>
      <LLMForm />
    </div>
  );
};

export default FeedTop;
