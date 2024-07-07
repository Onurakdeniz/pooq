import Link from "next/link";
import ProfileAvatar from "@/components/shared/avatar";
import { Button } from "@/components/ui/button";
import { Bookmark, ChevronUp, Reply } from "lucide-react";
import PostFooter from "./footer";
import { Author, Cast, Post as PostType } from "@/types/type";


 
 

type OptionalProps = 'hash' | 'tags' | 'entities' | 'isBookmarkedByUser' | 'isLikedByUser';

interface ProfilePostProps extends Omit<PostType, OptionalProps> {
  storyId: string;
  storyTitle: string;
  hash?: string;
  tags?: string[];
  entities?: string[];  
  isBookmarkedByUser?: boolean;
  isLikedByUser?: boolean;
}

const ProfilePost: React.FC<ProfilePostProps> = ({
  id,
  storyId,
  storyTitle,
  text,
  author,
  cast,
  hash,
  tags,
  entities,
  isBookmarkedByUser,
  isLikedByUser,
}) => {
  return (
    <div className="flex flex-col gap-4 border-b p-8">
      <Link
        href={`/story/${storyId}`}
        className="text-lg font-semibold hover:underline"
      >
        {storyTitle}
      </Link>
      <div className="flex h-8 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ProfileAvatar
            profile={author}
            size="LARGE"
            isMentioned={false}
            date={cast?.timestamp}
          />
        </div>
      </div>

      <div className="flex w-full justify-between">
        <div className="flex w-full text-pretty pt-2 text-sm font-light text-primary/60">
          {cast.text}
        </div>
      </div>
    </div>
  );
};

const StoryPost: React.FC<PostType> = ({ id, text, author, cast }) => {
  return (
    <div className="flex flex-col gap-4 border-b p-8">
      <div className="flex h-8 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ProfileAvatar
            profile={author}
            size="LARGE"
            isMentioned={false}
            date={cast?.timestamp}
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-primary/60">
          <Button
            variant={"ghost"}
            className="flex h-8 items-center gap-1 px-2 text-xs"
          >
            <Bookmark size={16} strokeWidth={1} />
            <div>Bookmark</div>
          </Button>
          <Button
            variant={"ghost"}
            className="flex h-8 items-center gap-1 px-2 text-xs"
          >
            <Reply size={16} strokeWidth={1} />
            <div>Reply</div>
          </Button>
          <Button
            variant={"outline"}
            className="flex h-8 w-14 items-center justify-between gap-1 border-none bg-accent px-2 text-xs font-bold hover:text-emerald-400"
          >
            <ChevronUp size={16} strokeWidth={1} />
            <div>{cast.reactions.likes_count}</div>
          </Button>
        </div>
      </div>

      <div className="flex w-full justify-between">
        <div className="flex w-full text-pretty pt-2 text-sm font-light text-primary/60">
          {cast.text}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {cast.replies.count > 0 && (
          <PostFooter replyCount={cast.replies.count} />
        )}
      </div>
    </div>
  );
};

export { ProfilePost, StoryPost };