import React from "react";
import Link from "next/link";
import ProfileAvatar from "@/components/shared/avatar";
import { Bookmark, ChevronUp, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Author } from "@/types/";
import BookmarkStory from "./bookmark";
import LikeButton from "./like";
import { storyTypeIcons, storyTypeTooltips } from "@/lib/constants";
import { StoryType } from "@prisma/client";

interface IStoryHeader {
  id: string;
  title?: string;
  author: Author;
  timestamp: string;
  numberOfLikes: number;
  isBookmarked: boolean;
  cardType: string;
  isLikedBuUserFid:boolean
  type: StoryType | null | undefined;
}

const StoryHeader: React.FC<IStoryHeader> = ({
  id,
  title,
  author,
  timestamp,
  numberOfLikes,
  isBookmarked,
  cardType,
  isLikedBuUserFid,
  type,
}) => {
  const IconComponent = type ? storyTypeIcons[type] : null;

  const renderIcon = () => {
    if (IconComponent) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-200 p-1.5 dark:border-emerald-950">
                <IconComponent
                  className="text-emerald-600"
                  strokeWidth={1.5}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{type && storyTypeTooltips[type]}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return null;
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between text-primary/80">
          {cardType === "FEED" ? (
            <Link href={`/story/${id}`} passHref>
              <div className="line-clamp-2 flex w-full items-center gap-2 text-lg font-semibold">
                {renderIcon()}
                <span> {title} </span>
              </div>
            </Link>
          ) : (
            <div className="line-clamp-2 flex w-full items-center gap-2 text-lg font-semibold">
              {renderIcon()}
              <span> {title} </span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ProfileAvatar
              author={author}
              size="LARGE"
              isMentioned={false}
              date={timestamp}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-2 text-xs text-primary/60">
              <BookmarkStory id={id} isBookmarkedProp={isBookmarked} />
              <LikeButton
                numberOfLikes={numberOfLikes}
                isLiked={isLikedBuUserFid}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryHeader;