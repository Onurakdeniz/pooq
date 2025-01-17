import React from "react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
 
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
} from "lucide-react";
import Tag from "@/components/shared/tag";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
 

const StoryHeader = () => {
  const title =
    "Deneme Burada ikinci tane title var bayada uzun bir title Deneme Burada Deneme Burada ikinci tane title var bayada uzun bir title Deneme Burada";
  return (
    <div className=" flex  flex-col     gap-2   p-8   hover:bg-accent  ">
      <div className="  flex  w-full  flex-col gap-6   ">
        <div className="flex h-8 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
          <div>profile</div>

            <time className="mb-1  text-end text-xs  font-normal text-primary/60 sm:order-last sm:mb-0">
              just now
            </time>
          </div>
          <div className="flex items-center gap-2 ">
            <div className=" items-cetner flex gap-2 text-xs text-primary/60">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"outline"}
                      className=" w-26 flex h-8 gap-2 p-1  px-2 "
                    >
                      <Bookmark size={20} strokeWidth={"1"} />
                      <div className="text-center   ">Bookmark</div>
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
                      variant={"outline"}
                      className=" flex  w-20 gap-2 p-1  px-2 hover:text-emerald-400 "
                    >
                      <ChevronUp size={24} strokeWidth={"2"} />
                      <div className="    ">132</div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Like Story</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div className=" line-clamp-2  flex w-full text-primary/70 ">
              {title}
            </div>

            <div className="flex items-center gap-2">  
            
            </div>
          </div>
          <div>
            <div className="flex w-full justify-between"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryHeader;
