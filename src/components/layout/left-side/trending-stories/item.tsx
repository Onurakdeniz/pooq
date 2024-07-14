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
import { storyTypeIcons, storyTypeTooltips } from "@/lib/constants";
import { ProfileAvatar } from "@/components/shared/avatar";

export const TrendingStoryItem: React.FC<TrendingItem> = ({
  storyId,
  title,
  author,
  numberOfPosts,
  isPromoted = false,
  type,
}) => {
  const IconComponent = type ? storyTypeIcons[type] : null;

  return (
    <div className="relative flex flex-col items-center gap-4 rounded-lg border px-3 py-3 text-sm hover:cursor-pointer hover:bg-primary-foreground hover:dark:border-neutral-700">
      <div className="flex w-full items-center justify-between  ">
        <div className="flex w-10/12 items-center gap-2">
          {IconComponent && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10   ">
                    <IconComponent
                      className="h-4 w-4 text-primary/70 "
                      strokeWidth={2}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{type && storyTypeTooltips[type]}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/t${titleToSlug(title!, storyId)}`} passHref>
                  <div className="line-clamp-2 text-wrap text-xs text-primary/70">
                    {title}
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent className="flex w-60" side="bottom" align="start">
                <p>{title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex h-full w-2/12  items-end justify-between pr-2">
          <div className="flex h-6 items-center gap-6 text-sm">
            <ProfileAvatar
              author={author}
              size="LARGE"
              isMentioned={false}
              format="avatarOnly"
            />
          </div>
          <span className="text-base font-semibold text-primary">
            {numberOfPosts}
          </span>
        </div>
      </div>

      {isPromoted && (
        <div className="absolute bottom-0 right-2 mb-2 h-4">
          <div className="h-1"> </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  variant="outline"
                  className="rounded-2xl border-none px-2 py-0.5  text-[10px] font-light text-primary/40   "
                >
                  Promoted
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>This story is promoted content</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};
