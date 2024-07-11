import { Button } from "@/components/ui/button";
import { Bookmark, CircleUser } from "lucide-react";
import React from "react";

const StoryFooter = ({ numberOfPosts }: { numberOfPosts: number | undefined }) => {
  return (
    <div className="flex items-center text-sm  justify-end text-primary/70">
      <div className="tems-center  gap-2 bg-accent/50 p-2  rounded-lg flex font-semibold  text-xs text-primary/50">
        <CircleUser size={16} strokeWidth={1} />
        <div>{numberOfPosts} Posts</div>
      </div>
    </div>
  );
};

export default StoryFooter;
