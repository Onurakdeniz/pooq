import { Badge } from "@/components/ui/badge";
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";

const StoryHover: React.FC<any> = ({ storyId }) => {
  return (
    <div>
      <HoverCard>
        <HoverCardTrigger asChild>
          <span className="inline-flex items-center">
            <Badge className="cursor-pointer rounded-sm border border-stone-200 bg-inherit px-2 py-1 text-xs font-normal text-primary/50 shadow-none hover:bg-stone-200 dark:border-stone-800 dark:text-primary/50 hover:dark:bg-primary/10">
              {storyId}
            </Badge>
          </span>
        </HoverCardTrigger>
        <HoverCardContent
          align="center"
          sideOffset={12}
          className=" flex w-72 flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span> {storyId}</span>
              <div className="flex items-center gap-1 text-xs text-primary/40">
                <User className="h-4 w-4" />
                <span className="">22K</span>
              </div>{" "}
            </div>
            <Button
              className="flex h-6 w-20 justify-between px-3 text-primary/60 shadow-none   "
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              <span>Follow</span>
            </Button>
          </div>
          <span className="text-xs text-primary/60">
            {" "}
            The React Framework – created and maintained by @vercel.Deneme
            Burada bi zun bir title Deneme Burada ikinci tane title var bayada
            uzun bir title Deneme Burada bi zun bir title DenemeDeneme Burada bi
            zun bir title Deneme Burada ikinci tane title var b{" "}
          </span>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default StoryHover;
