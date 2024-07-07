import React from "react";
import ProfileHeader from "./header";
import StoryCard from "@/components/shared/story-card";
import { ScrollArea } from "@/components/ui/scroll-area";

const ProfileFeed = ({ fid , type } : {fid:number , type: "STORY"| "POST" | "TAG"   }) => {
  return (
    <div>

      <div>
        <ScrollArea className="flex h-screen flex-col     ">
          <div className="flex flex-col   ">{fid}</div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ProfileFeed;
