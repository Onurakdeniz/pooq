import { Badge } from "@/components/ui/badge";
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";
import { Tag } from "@/types/index";

const Tag: React.FC<Tag> = (tag) => {
 
  return (
 
      <HoverCard>
        <HoverCardTrigger>
          <Badge className="  rounded-sm  border border-stone-200 bg-inherit px-2 py-1 text-xs font-normal     text-primary/50  shadow-none hover:cursor-pointer hover:bg-stone-200 dark:border-stone-800   dark:text-primary/50 hover:dark:bg-primary/10">
            {tag.name}
          </Badge>
        </HoverCardTrigger>
        <HoverCardContent
          align="center"
          sideOffset={12}
          className=" flex w-72 flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span> {tag.name}</span>
              <div className="flex items-center gap-1 text-xs text-primary/40">
                <User className="h-4 w-4" />
                <span className="">
                  {tag.followers}
                </span>
              </div> 
            </div>

            {tag.isFollowed ? (
              <Button
                className="flex h-6 w-20 justify-between px-3 text-primary/60 shadow-none   "
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                <span>Unfollow</span>
              </Button>
            ) : (
              <Button
                className="flex h-6 w-20 justify-between px-3 text-primary/60 shadow-none   "
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                <span>Follow</span>
              </Button>
            )}

            <Button
              className="flex h-6 w-20 justify-between px-3 text-primary/60 shadow-none   "
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              <span>Follow</span>
            </Button>
          </div>
          <span className="text-xs text-primary/60">
              {tag.description}
          </span>
        </HoverCardContent>
      </HoverCard>
 
  );
};

export default Tag;
