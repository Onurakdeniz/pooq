import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bookmark, ChevronUp } from "lucide-react";
import React from "react";

const FeedHeader = () => {
  return (
    <div className="flex h-16 border-b px-8">
      <div className=" flex w-full items-center gap-10 text-xs   text-primary/60">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                className=" w-26 flex h-10 gap-2 bg-accent p-1 px-3 "
                size="icon"
              >
                <Bookmark size={20} strokeWidth={"1"} />
                <div className="text-center   ">My Stories</div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bookmark in Story</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                className=" w-26 flex h-10 gap-2 p-1  px-3"
                size="icon"
              >
                <Bookmark size={20} strokeWidth={"1"} />
                <div className="text-center   ">My Posts</div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bookmark in Story</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                className=" w-26 flex h-10 gap-2 p-1  px-3 "
                size="icon"
              >
                <Bookmark size={20} strokeWidth={"1"} />
                <div className="text-center   "> Posts </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bookmark in Story</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default FeedHeader;
