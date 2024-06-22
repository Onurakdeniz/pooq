import { AvatarType } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import ProfileAvatar from "@/components/shared/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TrendingStoryItemProps {
  avatars: AvatarType[];
  title: string;
  view: number;
}

export const TrendingStoryItem: React.FC<TrendingStoryItemProps> = ({
  avatars,
  title,
  view,
}) => {
  return (
    <div className=" flex flex-col items-center gap-4 rounded-lg  border  p-3 text-sm  hover:cursor-pointer hover:bg-primary-foreground hover:dark:border-neutral-700 hover:dark:border-primary-foreground">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-9/12 flex-col gap-1">
          <Link className="" href="http://www.wdasdasd.sds">
          <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
        <div className=" line-clamp-3 text-wrap text-primary/70 ">
              {title}
            </div>
        </TooltipTrigger>
        <TooltipContent className="flex w-60" side="bottom" align="start">
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
          
          </Link>
        </div>

        <div className="flex w-3/12  justify-end gap-4">
          <div className="flex  items-center self-end    ">
            <ProfileAvatar size="NORMAL" />
          </div>
          <span className=" w-6 text-end text-primary/70">{view} </span>
        </div>
      </div>
    </div>
  );
};
