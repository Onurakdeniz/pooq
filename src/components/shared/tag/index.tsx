import React from "react";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";

// Define the Tag type
interface TagProps {
  id: string;
  name: string;
  followers?: number;
  description?: string;
  isFollowed?: boolean;
}

const Tag: React.FC<TagProps> = ({ name, followers, description, isFollowed }) => {

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Badge className="rounded-sm border border-stone-200 bg-inherit px-2 py-1 text-xs font-normal text-primary/50 shadow-none hover:cursor-pointer hover:bg-stone-200 dark:border-stone-800 dark:text-primary/50 hover:dark:bg-primary/10">
          {name}
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        sideOffset={12}
        className="flex w-72 flex-col z-40 dark:bg-[#1a1a1a] bg-[#fdfcf5] gap-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{name}</span>
            <div className="flex items-center gap-1 text-xs text-primary/40">
              <User className="h-4 w-4" />
              <span>{followers}</span>
            </div>
          </div>

          <Button
            className="flex h-6 w-20 justify-between px-3 text-primary/60 shadow-none"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            <span>{isFollowed ? 'Unfollow' : 'Follow'}</span>
          </Button>
        </div>
        <span className="text-xs text-primary/60">{description}</span>
      </HoverCardContent>
    </HoverCard>
  );
};

export default Tag;
