import FeedActions from "@/app/feed/components/top/actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, SquarePen } from "lucide-react";
import React from "react";

const TagTop = ({ tag }: { tag: string }) => {
  return (
    <div className="flex w-full flex-col  ">
      <div className=" flex h-16 w-full items-center justify-between border-b px-8  ">
        <div className="text-2xl font-semibold capitalize  ">{tag}</div>
      </div>
    </div>
  );
};

export default TagTop;
