import React from "react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ProfileAvatar from "@/components/shared/avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
} from "lucide-react";
import Tag from "@/components/shared/tag";

const StoryTop = () => {
  const title =
    "Deneme Burada ikinci tane title var bayada uzun bir title Deneme Burada Deneme Burada ikinci tane title var bayada uzun bir title Deneme Burada";
  return (
    <div className=" flex  flex-col   gap-2 p-8 pb-0   ">
      <div className="mb-4 flex  w-full  flex-col gap-6 border-b pb-4   ">
        <div className="flex h-8 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ProfileAvatar size="LARGE" />

            <time className="mb-1  text-end text-xs  font-normal text-primary/60 sm:order-last sm:mb-0">
              just now
            </time>
          </div>
          <div className="flex items-center gap-2 ">
            <div className=" items-cetner flex gap-2 text-xs text-primary/60">
              <Button
                variant={"outline"}
                className=" flex h-8 w-28 gap-2 p-1  px-2"
                size="icon"
              >
                <ChevronUp size={20} />
                <div className="text-center ">Bookmark</div>
              </Button>

              <Button
                variant={"outline"}
                className=" flex h-8 w-20 gap-2 p-1  px-2"
                size="icon"
              >
                <ChevronUp size={20} />
                <div className="text-center ">132</div>
              </Button>
            </div>
          </div>
        </div>
      <div className="flex-col flex gap-2"> 
        <div className=" flex w-full items-center justify-between gap-2 ">
          <div className="  flex   ">{title}</div>
          <div className="flex items-center gap-2 text-primary/60  "></div>
        </div>
        <div className="flex flex-wrap  items-center gap-2">
          <Badge className="  rounded-sm bg-neutral-50 px-2 py-1   text-xs  font-normal text-neutral-500 shadow-sm hover:cursor-pointer hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-500 hover:dark:bg-neutral-900">
            AI Blockcian
          </Badge>
          <Badge className="  rounded-sm bg-neutral-50 px-2 py-1   text-xs  font-normal text-neutral-500 shadow-sm hover:cursor-pointer hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-500 hover:dark:bg-neutral-900">
            AI Blockcian
          </Badge>
          <Badge className="  rounded-sm bg-neutral-50 px-2 py-1   text-xs  font-normal text-neutral-500 shadow-sm hover:cursor-pointer hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-500 hover:dark:bg-neutral-900">
            AI Blockcian
          </Badge>
        </div>
        </div>
        <div>
          <div className="flex w-full justify-between">
            <div className="flex    text-pretty pt-2 text-sm font-light text-primary/60">
              Deneme Burada bi zun bir title Deneme Burada ikinci tane title var
              bayada uzun bir title Deneme Burada bi zun bir title DenemeDeneme
              Burada bi zun bir title Deneme Burada ikinci tane title var bayada
              uzun bir title Deneme Burada bi zun bir title DenemeDeneme Burada
              bi zun bir title Deneme Burada ikinci tane title var bayada uzun
              bir title Deneme Burada bi zun bir title Deneme
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryTop;
