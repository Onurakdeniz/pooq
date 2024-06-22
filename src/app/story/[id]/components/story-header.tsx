import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, SquarePen } from "lucide-react";
import React from "react";

const StoryHeader = () => {
  return (
    <div className="flex h-16 items-center justify-between border-b px-8 ">
      <div className="flex items-center gap-4 text-primary/80">
        <Button variant={"outline"} size="icon">
          <ArrowLeft size="20" />
        </Button>

        <span>Back to feed</span>
      </div>
      <div>
        <Button variant={"outline"} className=" font-bold text-primary/60 flex gap-2" >
          <SquarePen size="16"/>
          <span>Write</span>
        </Button>
      </div>
    </div>
  );
};

export default StoryHeader;
