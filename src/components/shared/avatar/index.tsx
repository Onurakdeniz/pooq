import { Avatar, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Tag from "../tag";
import {Profile} from "@/types/index"

 
interface IProfileAvatar {
  size : string
  isMentioned : boolean
  badges?  : string [] 
  profile : Profile
}
 
 

const ProfileAvatar: React.FC<IProfileAvatar> = ({
  size,
  badges,
  isMentioned = false,
  profile
}) => {
  const avatarSize = size === "LARGE" ? "h-8 w-8" : "h-6 w-6";
  const avatarName = size === "LARGE" ? "flex" : "hidden";
  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className="flex items-center gap-2 hover:cursor-pointer">
          <Avatar className={avatarSize}>
            <AvatarImage src={profile.pfp_url} />
          </Avatar>
          <div className={avatarName}>{profile.display_name}</div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        align="center"
        sideOffset={12}
        className=" flex w-96 flex-shrink shadow-lg "
      >
          <ProfileHoverContent {...profile} />

      </HoverCardContent>
    </HoverCard>
  );
};

export default ProfileAvatar;

 

export const ProfileHoverContent:React.FC<Profile> = (profile) => {
  return (
    <div className="flex w-96 flex-col   gap-3 border-none p-4 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile.pfp_url} />
          </Avatar>
          <div className="flex flex-col  text-sm">
            <span> {profile.display_name}</span>
            <span> @{profile.username}</span>
          </div>
        </div>
        <Button
          className="flex h-6 w-24 justify-between gap-2 px-3 text-primary/60 shadow-none   "
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          <span>Follow</span>
        </Button>
      </div>
      <div className="flex gap-3 ">
        <div className="flex items-baseline gap-1  text-sm text-primary/40">
          <span className="">{profile.following_count} Following</span>
        </div>

        <div className="flex items-center gap-1   text-sm    text-primary/40">
          <span className="">{profile.follower_count} Followers</span>
        </div>
      </div>

      <span className="text-xs text-primary/60"> {profile.profile.bio.text} </span>
      <div className=" flex flex-wrap gap-2 ">
        { profile.tags.map(
          (item) => (
            <Tag {...item} key={item.id}/>
          )
        )

        }
        
      </div>
    </div>
  );
};
