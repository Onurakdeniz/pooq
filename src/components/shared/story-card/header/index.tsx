import React from "react";
import Link from "next/link";
 
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
import { titleToSlug } from "@/lib/helper";
import { ProfileAvatar } from "../../avatar";
import renderIcon from "../../story-icon";
interface IStoryHeader {
  id: number;
  hash: string;
  title?: string;
  author: Author;
  timestamp: string;
  numberOfLikes: number;
  isBookmarked: boolean;
  cardType: string;
  isLikedBuUserFid: boolean;
  type: StoryType | null | undefined;
}

const StoryHeader: React.FC<IStoryHeader> = ({
  id,
  title,
  author,
  hash,
  timestamp,
  numberOfLikes,
  isBookmarked,
  cardType,
  isLikedBuUserFid,
  type,
}) => {
 

  return (
    <div className="flex w-full flex-col  ">
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between text-primary/80">
          {cardType === "FEED" && title ? (
            <Link href={`/t${titleToSlug(title, id)}`} passHref>
              <div className="line-clamp-2 flex w-full items-center gap-2 text-lg font-semibold">
                {renderIcon(type)}
                <span> {title} </span>
              </div>
            </Link>
          ) : (
            <div className="line-clamp-2 flex w-full items-center gap-2 text-lg font-semibold">
              {renderIcon(type)}
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
              format="full"
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
