import React from "react";
import FeedActions from "./actions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LLMForm } from "./llm";

const FeedTop = () => {
  return (
    <div className="flex-col flex  ">


    <div className=" flex h-16 w-full justify-between items-center border-b  px-8">
      <div className="text-2xl font-light text-emerald-500">
        Latest Stories
      </div>
      <FeedActions />
    </div>
    <LLMForm/>
    </div>
  );
};

export default FeedTop;
