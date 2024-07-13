import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
 
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { TrendingItem } from "@/types";
import { titleToSlug } from "@/lib/helper";

export const TrendingStoryItem: React.FC<TrendingItem> = ({
  storyId,
  title,
  authorFid,
  numberOfPosts,
  isPromoted,
  type
}) => {
  return (
    <div className="flex items-center gap-4 rounded-lg border px-4 py-2 text-sm hover:cursor-pointer hover:bg-primary-foreground hover:dark:border-neutral-700 hover:dark:border-primary-foreground">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-9/12 gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/t${titleToSlug(title!, storyId)}`} passHref>
                  <div className="line-clamp-3 text-wrap text-primary/70">
                    {title}
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                className="flex w-60"
                side="bottom"
                align="start"
              >
                <p>{title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex w-3/12 h-full justify-end gap-4">
          <div className="flex items-center self-end"></div>
          <span className="w-6 text-end text-primary/70">{numberOfPosts}</span>
        </div>
      </div>
    </div>
  );
};