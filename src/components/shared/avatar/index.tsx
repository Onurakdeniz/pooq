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

interface IProfile {
  name: string;
  avatarUrl: string;
  followers: number;
  following: number;
  bio: string;
  userName: string;
  fid: number;
  custodyAddress: number;
  verifications: string[];
  verifiedEthAddresses: string[];
  activeStatus: boolean;
  powerBadge: boolean;
  viewer: {
    following: string;
    followedBy: string;
  };
}

interface IProfileAvatar {
  size: "NORMAL" | "LARGE";
  profile?: IProfile;
  badges?: string[];
}

const profile = {
  name: "Alice Johnson",
  avatarUrl:
    "https://wrpcd.net/cdn-cgi/image/fit=contain,f=auto,w=144/https%3A%2F%2Fi.imgur.com%2FIzJxuId.jpg",
  followers: 450,
  following: 200,
  bio: "Tech enthusiast and software developer. Love to explore new technologies.",
  userName: "alice_j",
  fid: 101,
  custodyAddress: 1234567890,
  verifications: ["Twitter", "GitHub"],
  verifiedEthAddresses: ["0x1234567890abcdef1234567890abcdef12345678"],
  activeStatus: true,
  powerBadge: true,
  viewer: {
    following: "yes",
    followedBy: "no",
  },
};

const ProfileAvatar: React.FC<IProfileAvatar> = ({ size, badges }) => {
  const avatarSize = size === "LARGE" ? "h-10 w-10" : "h-6 w-6"; 
  const avatarName = size === "LARGE" ? "flex" : "hidden"; 
  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className="flex items-center gap-2 hover:cursor-pointer">
          <Avatar className={avatarSize}>
            <AvatarImage src={profile.avatarUrl} />
          </Avatar>
          <div className={avatarName}>{profile.name}</div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        align="center"
        sideOffset={12}
        className=" flex w-96 flex-shrink flex-col gap-3 "
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile.avatarUrl} />
            </Avatar>
            <div className="flex flex-col  text-sm">
              <span> {profile.name}</span>
              <span> @{profile.userName}</span>
            </div>
          </div>
          <Button
            className="flex h-6 w-20 justify-between px-3 text-primary/60 shadow-none   "
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            <span>Follow</span>
          </Button>
        </div>
        <div className="flex gap-3 ">
          <div className="flex items-baseline gap-1  text-sm text-primary/40">
            <span className="">FID:{profile.fid}</span>
          </div>
          <div className="flex items-baseline gap-1  text-sm text-primary/40">
            <span className="">{profile.following} Following</span>
          </div>

          <div className="flex items-center gap-1   text-sm    text-primary/40">
            <span className="">{profile.followers} Followers</span>
          </div>
        </div>

        <span className="text-xs text-primary/60"> {profile.bio} </span>
        <div className=" flex flex-wrap   gap-2 ">
          <Tag />
          <Tag />
          <Tag />
          <Tag /> <Tag />
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ProfileAvatar;
