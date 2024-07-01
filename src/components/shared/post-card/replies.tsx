import ProfileAvatar from "@/components/shared/avatar";
import Tag from "@/components/shared/tag";
import { Button } from "@/components/ui/button";
import { Bookmark, ChevronUp, CircleAlert, Reply } from "lucide-react";
import React from "react";

const PostReplies = () => {
  return (
    <div className="flex  items-center justify-between pt-4">
      <div className="flex w-full flex-col gap-4">
        <div className=" flex flex-col gap-6 border-l  ">
          <PostReply />
          <PostReply />
        </div>
      </div>
    </div>
  );
};

export default PostReplies;

const PostReply = () => {
  return (
    <div className="   ms-6">
      <div className="flex flex-col gap-6">
        <div className="flex h-8 items-center justify-between  gap-3">
          <div className="flex items-center gap-3">
           <div>profile</div>

            <time className="mb-1  text-end text-xs  font-normal text-primary/60 sm:order-last sm:mb-0">
              just now
            </time>
          </div>

          <div className=" items-cetner flex gap-2 text-xs text-primary/60">
            <Button
              variant={"outline"}
              className="flex h-8 w-16 items-center  justify-between gap-1 border-none  bg-accent  px-2 text-xs  font-bold  hover:text-emerald-400  "
            >
              <ChevronUp size={16} strokeWidth={1} />
              <div>232</div>
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-6 rounded-md    border-gray-200  dark:border-gray-600   sm:flex">
            <div className="text-sm font-light   text-muted-foreground ">
         
            </div>
          </div>       
          <div className="flex items-center gap-2"> 
     
          </div>
        </div>
      </div>
    </div>
  );
};
