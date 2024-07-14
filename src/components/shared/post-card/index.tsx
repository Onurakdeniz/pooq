import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bookmark, ChevronUp, Reply } from "lucide-react";
import PostFooter from "./footer";
import { Author, Post as PostType } from "@/types";
import { titleToSlug } from "@/lib/helper";
import { ProfileAvatar } from "../avatar";
import TextCard from "../text-card";

type OptionalProps =
  | "hash"
  | "tags"
  | "entities"
  | "isBookmarkedByUser"
  | "isLikedByUser";

interface ProfilePostProps extends Omit<PostType, OptionalProps> {
  storyId: number;
  storyTitle: string;
  hash?: string;
  tags?: string[];
  entities?: string[];
}

const ProfilePost: React.FC<ProfilePostProps> = ({
  id,
  storyId,
  storyTitle,
  text,
  author,
  hash,
  tags,
  entities,
  isBookmarkedByUserId,
  isLikedBuUserFid,
  timestamp,
}) => {
  return (
    <div className="flex flex-col gap-4 border-b p-8">
      <Link href={`/t${titleToSlug(storyTitle, storyId)}`} passHref>
        {storyTitle}
      </Link>
      <div className="flex h-8 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ProfileAvatar
            author={author}
            size="LARGE"
            isMentioned={false}
            date={timestamp}
            format="full"
          />
        </div>
      </div>

      <div className="flex w-full justify-between">
        <div className="flex w-full text-pretty pt-2 text-sm font-light text-primary/60">
          {text}
        </div>
      </div>
    </div>
  );
};
const StoryPost: React.FC<PostType> = ({
  id,
  text,
  author,
  numberOfLikes,
  timestamp,
  numberOfReplies,
}) => {
  return (
    <div className="flex flex-col gap-3 px-8 py-4">
      <div className="flex h-8 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ProfileAvatar
            author={author}
            size="LARGE"
            isMentioned={false}
            date={timestamp}
            format="full"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-primary/60">
          <Button
            variant="ghost"
            className="flex h-8 items-center gap-1 rounded-lg bg-accent px-2 text-xs"
          >
            <Bookmark size={16} strokeWidth={1} />
          </Button>
          <Button
            variant="ghost"
            className="flex h-8 items-center gap-1 rounded-lg bg-accent px-2 text-xs"
          >
            <Reply size={16} strokeWidth={1.5} />
          </Button>
          <Button
            variant="outline"
            className="flex h-8 w-14 items-center justify-between gap-1 border-none bg-accent px-2 text-xs font-bold hover:text-emerald-400"
          >
            <ChevronUp size={16} strokeWidth={1} />
            <div>{numberOfLikes}</div>
          </Button>
        </div>
      </div>

      <div className="flex w-full justify-between rounded-2xl">
        <div className="flex w-full text-pretty pt-2 text-sm font-light text-primary/60">
          <TextCard text={text} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {numberOfReplies > 0 && <PostFooter replyCount={numberOfReplies} />}
      </div>
    </div>
  );
};

const FeedStoryPost: React.FC<PostType> = ({
  id,
  text,
  author,
  numberOfLikes,
  timestamp,
  numberOfReplies,
}) => {
  return (
    <div className="flex flex-col gap-3  pl-6 pb-4    ">
      <div className="flex h-8 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
        <ProfileAvatar
            author={author}
            size="LARGE"
            isMentioned={false}
            date={timestamp}
            format="full"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-primary/60">
          <Button
            variant="ghost"
            className="flex h-8 items-center gap-1 rounded-lg bg-accent px-2 text-xs"
          >
            <Bookmark size={14} strokeWidth={1} />
          </Button>
          <Button
            variant="ghost"
            className="flex h-8 items-center gap-1 rounded-lg bg-accent px-2 text-xs"
          >
            <Reply size={14} strokeWidth={1.5} />
          </Button>
          <Button
            variant="outline"
            className="flex h-8 w-12 items-center justify-between gap-1 border-none bg-accent px-2 text-xs font-bold hover:text-emerald-400"
          >
            <ChevronUp size={14} strokeWidth={1} />
            <div>{numberOfLikes}</div>
          </Button>
        </div>
      </div>

      <div className="flex w-full justify-between rounded-2xl">
        <div className="flex w-full text-pretty pt-1 text-xs font-light text-primary/60">
          <TextCard text={text} />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {numberOfReplies > 0 && <PostFooter replyCount={numberOfReplies} />}
      </div>
    </div>
  );
};

 

export { ProfilePost, StoryPost , FeedStoryPost };
