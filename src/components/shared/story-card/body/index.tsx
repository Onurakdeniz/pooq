import ProfileAvatar from "@/components/shared/avatar";
import Tag from "@/components/shared/tag";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, ChevronUp, Reply } from "lucide-react";
import React from "react";

const CardBody = () => {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex  text-sm   font-light   text-muted-foreground ">
        Deneme Burada bi zun bir title Deneme Burada ikinci tane title var
        bayada uzun bir title Deneme Burada bi zun bir title DenemeDeneme Burada
        bi zun bir title Deneme Burada ikinci tane title var bayada uzun bir
        title Deneme Burada bi zun bir title DenemeDeneme Burada bi zun bir
        title Deneme Burada ikinci tane title var bayada uzun bir title Deneme
        Burada bi zun bir title Deneme
      </div>
      <div>
        <div>
          <div className="flex w-full flex-col gap-4">
            <ol className="relative ml-3 border-s ">
              <li className="mb-10 ms-6">
                <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-neutral-400  dark:ring-neutral-800  ">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="https://wrpcd.net/cdn-cgi/image/fit=contain,f=auto,w=144/https%3A%2F%2Fi.imgur.com%2FIzJxuId.jpg" />
                  </Avatar>
                </span>
                <div className="flex flex-col gap-4">
                  <div className="flex h-8 items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <ProfileAvatar size="LARGE" />

                      <time className="mb-1  text-end text-xs  font-normal text-primary/60 sm:order-last sm:mb-0">
                        just now
                      </time>
                    </div>

                    <div className=" items-cetner flex gap-2 text-xs text-primary/60">
                      <Button
                        variant={"ghost"}
                        className="flex h-8    items-center   gap-1   px-2 text-xs  "
                      >
                        <Bookmark size={16} strokeWidth={1} />
                        <div>Bookmark</div>
                      </Button>
                      <Button
                        variant={"ghost"}
                        className="flex  h-8   items-center   gap-1 px-2 text-xs  "
                      >
                        <Reply size={16} strokeWidth={1} />
                        <div>Reply</div>
                      </Button>
                      <Button
                        variant={"outline"}
                        className="flex h-8 w-14 items-center  justify-between gap-1 border-none  bg-accent  px-2 text-xs  font-bold  hover:text-emerald-400  "
                      >
                        <ChevronUp size={16} strokeWidth={1} />
                        <div>0</div>
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-6 rounded-md    border-gray-200  dark:border-gray-600   sm:flex">
                      <div className="text-sm font-light   text-muted-foreground ">
                        Deneme Burada bi zun bir title Deneme Burada ikinci tane
                        title var bayada uzun bir title Deneme Burada bi zun bir
                        title DenemeDeneme Burada bi zun bir title Deneme Burada
                        ikinci tane title var bayada uzun bir title Deneme
                        Burada bi zun bir title DenemeDeneme Burada bi zu
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag />
                      <Badge className="  rounded-sm bg-emerald-50 px-2 py-1   text-[10px]  font-normal text-emerald-500 shadow-sm hover:cursor-pointer hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-500 hover:dark:bg-emerald-900">
                        AI Blockcian
                      </Badge>
                    </div>
                  </div>
                </div>
              </li>

              <li className="ms-6">
                <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full ring-2   dark:ring-neutral-800  ">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="https://wrpcd.net/cdn-cgi/image/fit=contain,f=auto,w=144/https%3A%2F%2Fi.imgur.com%2FIzJxuId.jpg" />
                  </Avatar>
                </span>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-primary/70">
                      Vitalik Buterin
                    </div>
                    <time className="mb-1 w-1/12 text-end text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                      just now
                    </time>
                  </div>
                  <div className="flex items-center justify-between gap-6 rounded-md    border-gray-200  dark:border-gray-600   sm:flex">
                    <div className="text-sm font-light  text-muted-foreground ">
                      Deneme Burada bi zun bir title Deneme Burada ikinci tane
                      title var bayada uzun bir title Deneme Burada bi zun bir
                      title DenemeDeneme Burada bi zun bir title Deneme Burada
                      ikinci tane title var bayada uzun bir title Deneme Burada
                      bi zun bir title DenemeDeneme Burada bi zu
                    </div>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardBody;
