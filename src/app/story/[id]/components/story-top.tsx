import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, SquarePen } from "lucide-react";
import React from "react";
import { PostWrite } from "./write";

const StoryTop = () => {
  return (
    <div className="flex h-16 items-center justify-between   border-b px-8 ">
      <div className="flex items-center gap-4 text-primary/80">
        <Button variant={"outline"} size="icon">
          <ArrowLeft size="20" />
        </Button>

        <span>Back to feed</span>
      </div>
      <div>
        <PostWrite />
      </div>
    </div>
  );
};

export default StoryTop;
