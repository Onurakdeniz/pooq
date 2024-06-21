import ProfileAvatar from "@/components/shared/avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, ChevronUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import React from "react";
import Tag from "@/components/shared/tag";

interface CardHeaderProps {
  title: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ title }) => {
  return (
    <div className="mb-4 flex  w-full  flex-col gap-6  ">
      <div className="flex h-8 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ProfileAvatar size="LARGE" />

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
                    className=" flex h-8 w-28 gap-2 p-1  px-2"
                    size="icon"
                  >
                    <Bookmark size={18} />
                    <div className="text-center ">Bookmark</div>
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
                    className=" flex h-8 w-20 gap-2 p-1  px-2"
                    size="icon"
                  >
                    <ChevronUp size={20} />
                    <div className="text-center ">132</div>
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
        <div className=" line-clamp-2  flex w-full text-primary/70 ">
          {title}
        </div>

        <div className="flex items-center gap-2">
           <Tag/>
           <Tag/>
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
