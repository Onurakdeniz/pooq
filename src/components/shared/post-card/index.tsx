import ProfileAvatar from "@/components/shared/avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  LoaderCircle,
  Minus,
  Plus,
  Reply,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Tag from "@/components/shared/tag";
import CardBody from "@/components/shared/story-card/body";
import PostReplies from "./replies";
import PostFooter from "./footer";
import { Post as PostType } from "@/types/type";

const Post: React.FC<PostType> = ({
  id,
  text,
  hash,
  tags,
  entities,
  isBookmarkedByUser,
  author,
  cast,
  isLikedByUser,
}) => {
  console.log("cast", id);
  return (
    <div className="flex flex-col gap-4 border-b p-8  ">
      <div className="flex h-8 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ProfileAvatar
            profile={author}
            size="LARGE"
            isMentioned={false}
            date={cast.timestamp}
          />

       
        </div>

        <div className=" items-cetner flex gap-2 text-xs text-primary/60">
          <Button
            variant={"ghost"}
            className="flex h-8    items-center   gap-1   px-2 text-xs  "
          >
            <Bookmark size={16} strokeWidth={1} />
            <div>Bookmark</div>
          </Button>
          <Button
            variant={"ghost"}
            className="flex  h-8   items-center   gap-1 px-2 text-xs  "
          >
            <Reply size={16} strokeWidth={1} />
            <div>Reply</div>
          </Button>
          <Button
            variant={"outline"}
            className="flex h-8 w-14 items-center  justify-between gap-1 border-none  bg-accent  px-2 text-xs  font-bold  hover:text-emerald-400  "
          >
            <ChevronUp size={16} strokeWidth={1} />
            <div>{cast.reactions.likes_count}</div>
          </Button>
        </div>
      </div>

      <div>
        <div className="flex w-full justify-between">
          <div className="w-12/12 flex  text-pretty pt-2 text-sm font-light text-primary/60">
            {cast.text}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2"></div>
    </div>
  );
};

export default Post;

// <PostReplies />
// <PostFooter />
