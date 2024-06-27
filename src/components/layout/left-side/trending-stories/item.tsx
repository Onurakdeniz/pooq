 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import ProfileAvatar from "@/components/shared/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

 import {TrendingItem} from "@/types/index"

export const TrendingStoryItem: React.FC<TrendingItem> = ({
 storyId,text,title,author,likes
}) => {

  const firstLetter = author?.display_name?.[0]
  return (
    <div className=" flex flex-col items-center gap-4 rounded-lg  border  p-4 text-sm  hover:cursor-pointer hover:bg-primary-foreground hover:dark:border-neutral-700 hover:dark:border-primary-foreground">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-9/12 flex-col gap-1">
        <Link href={`/story/${storyId}`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className=" line-clamp-3 text-wrap text-primary/70 ">
                    {title}
                  </div>
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
          </Link>
        </div>

        <div className="flex w-3/12  justify-end gap-4">
          <div className="flex  items-center self-end    ">
            <ProfileAvatar size="NORMAL" profile={author} isMentioned >
            <Avatar className="w-6 h-6" >
              <AvatarImage src={author.pfp_url} />
              <AvatarFallback>{firstLetter}</AvatarFallback>
            </Avatar>

            </ProfileAvatar>
           
          </div>
          <span className=" w-6 text-end text-primary/70">{likes} </span>
        </div>
      </div>
    </div>
  );
};
