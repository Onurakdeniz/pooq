import { AvatarType } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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
    <div className=" flex items-center rounded-lg flex-col gap-4  border  p-4 hover:cursor-pointer  hover:bg-primary-foreground hover:dark:border-primary-foreground hover:dark:border-neutral-700 text-sm">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-9/12 flex-col gap-1">
          <Link className="" href="http://www.wdasdasd.sds">
            <div className=" line-clamp-3 text-wrap text-primary/70 ">
              {title}
            </div>
          </Link>
        </div>

        <div className="flex w-3/12  gap-4 justify-end">
            
        <div className="flex  items-center justify-end -space-x-4   ">
          {avatars.map((avatar) => (
            <Avatar className="h-6 w-6   ">
              <AvatarImage className="rounded" src={avatar.url} />
              <AvatarFallback className="h-5 w-5">{avatar.name}</AvatarFallback>
            </Avatar>
          ))}
        </div>
          <span className="  text-primary/60 w-6 text-end">{view} </span>
          </div>
      </div>
 
    </div>
  );
};
