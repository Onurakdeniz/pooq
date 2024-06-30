import ProfileAvatar from "@/components/shared/avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, ChevronUp, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import React from "react";
import Tag from "@/components/shared/tag";
import { Author as Profile} from "@/types/type";

interface IStoryHeader {
  title: string;
  author: Profile;
  date: string;
  numberOfLikes : number
}

const StoryHeader: React.FC<IStoryHeader> = ({ title, author,  date , numberOfLikes }) => {
  return (
    <div className="mb-4 flex  w-full  flex-col gap-4   ">
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between text-primary/80">
          <div className=" line-clamp-2  flex  w-11/12 text-xl font-semibold    ">
            {title}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>AI Generated</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex h-8 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ProfileAvatar
              profile={author}
              size="LARGE"
              isMentioned={false}
              date={date}
            />
          </div>
          <div className="flex items-center gap-2 ">
            <div className=" items-cetner flex gap-2 text-xs text-primary/60">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="   flex h-8 justify-center gap-2  font-light"
                      size="icon"
                    >
                      <Bookmark size={20} strokeWidth={"1"} />
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
                      className=" flex h-8 w-20 gap-2 p-1  px-2 font-light"
                      size="icon"
                    >
                      <ChevronUp size={24} strokeWidth={"1"} />
                      <div className="    ">{numberOfLikes}</div>
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
      </div>
    </div>
  );
};

export default StoryHeader;
