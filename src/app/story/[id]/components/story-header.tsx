import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";

const StoryHeader = () => {
  return (
    <div className="flex h-16 items-center justify-between border-b px-8 ">
      <div className="flex items-center gap-2">
        <Button variant={"outline"} size="icon">
          <ArrowLeft size="20" />
        </Button>

        <span>Back to feed</span>
      </div>
      <div>
        <Button>Cast</Button>
      </div>
    </div>
  );
};

export default StoryHeader;
