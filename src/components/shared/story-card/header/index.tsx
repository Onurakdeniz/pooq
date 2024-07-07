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
import { Author as Profile ,  CastViewerContext} from "@/types/type";
import BookmarkStory from "./bookmark";
import Link from "next/link";
import LikeButton from "./like";

interface IStoryHeader {
  id: string;
  title: string;
  author: Profile;
  date: string;
  numberOfLikes: number;
  isBookmarked: boolean;
  type: string;
  viewer_context : CastViewerContext
}

const StoryHeader: React.FC<IStoryHeader> = ({
  id,
  title,
  author,
  date,
  numberOfLikes,
  isBookmarked,
  type,
  viewer_context
}) => {
  return (
    <div className=" flex w-full flex-col  ">
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between text-primary/80">
          {type === "FEED" ? (
            <Link href={`/story/${id}`} passHref>
              <div className="line-clamp-2 flex w-full  text-lg font-semibold">
                {title}
              </div>
            </Link>
          ) : (
            <div className="line-clamp-2 flex w-full text-lg font-semibold">
              {title}
            </div>
          )}
        
        </div>
        <div className="flex  items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ProfileAvatar
              profile={author}
              size="LARGE"
              isMentioned={false}
              date={date}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-2 text-xs text-primary/60">
              <BookmarkStory id={id} isBookmarkedProp={isBookmarked} />
              <LikeButton numberOfLikes={numberOfLikes} isLiked={viewer_context.liked} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryHeader;
