"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Filter } from "lucide-react";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLLMFilterStore } from "@/store/llm-button";

const FeedLLM = () => {
  const open = useLLMFilterStore((state)=>state.open)
  const setOpen = useLLMFilterStore ( (state) => state.setOpen )

  const handleOpen = () => {
    setOpen();
  };

 

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              onClick={handleOpen}
              className={`flex h-8 justify-between gap-2 border  px-3 shadow-none ${
                open
                  ? "border-none bg-emerald-100 text-sm text-emerald-600 hover:bg-emerald-200 hover:text-emerald-600 dark:bg-emerald-800 dark:text-emerald-400 hover:dark:bg-emerald-700"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <Bot size="12" />
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add to library</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FeedLLM;

 

export const LLMForm = () => {
    const open = useLLMFilterStore((state)=>state.open)
    const setOpen = useLLMFilterStore ( (state) => state.setOpen )
    const handleClick = () => {
        console.log("okay")
        setOpen()
    }
  return (
    <div className= {`  h-48  flex-col gap-2 px-8 py-2 ${open  ? "flex" : "hidden"} `}>
      <Textarea
        className="h-full border py-4 font-semibold text-primary/70 shadow-none focus-visible:ring-0"
        placeholder="Type your message here."
      />
      <div className="flex items-center justify-end">
        <Button className="h-7 justify-end " variant="default" onClick={handleClick}>
          Create
        </Button>
      </div>
    </div>
  );
};
