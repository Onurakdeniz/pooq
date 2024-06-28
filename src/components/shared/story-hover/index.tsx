import { Badge } from "@/components/ui/badge";
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";
import { HoverStory } from "@/types";
interface StoryHoverProps {
  hoverStory : HoverStory
  children: React.ReactNode;
}


const StoryHover: React.FC<StoryHoverProps> = ({ hoverStory, children }) => {
  return (
 
      <HoverCard>
        <HoverCardTrigger asChild>
          {children}
        </HoverCardTrigger>
        <HoverCardContent
          align="center"
          sideOffset={12}
          className=" flex w-72 flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span> {hoverStory.id}</span>
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
           {hoverStory.text}
          </span>
        </HoverCardContent>
      </HoverCard>
 
  );
};

export default StoryHover;
