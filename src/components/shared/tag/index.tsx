import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";

interface TagProps {
  id: string;
  name: string;
  description?: string;
}

const Tag: React.FC<TagProps> = ({ name, description }) => {
  const encodedTagName = encodeURIComponent(name);

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Link href={`/tag?tag=${encodedTagName}`}>
          <Badge className="rounded-sm border border-stone-200 bg-inherit px-2 py-1 text-xs font-normal text-primary/50 shadow-none hover:cursor-pointer hover:bg-stone-200 dark:border-stone-800 dark:text-primary/50 hover:dark:bg-primary/10">
            {name}
          </Badge>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        sideOffset={12}
        className="z-40 flex w-72 flex-col gap-4 bg-[#fdfcf5] dark:bg-[#1a1a1a]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{name}</span>
            <div className="flex items-center gap-1 text-xs text-primary/40">
              <User className="h-4 w-4" />
            </div>
          </div>
        </div>
        <span className="text-xs text-primary/60">{description}</span>
      </HoverCardContent>
    </HoverCard>
  );
};

export default Tag;

/*
<Button
className="flex h-6 w-20 justify-between px-3 text-primary/60 shadow-none"
variant="outline"
>
<Plus className="h-4 w-4" />

</Button>

*/
