"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Tag from "../tag";
import { Profile } from "@/types/index";
import { api } from "@/trpc/react";

interface IProfileAvatar {
  size: string;
  isMentioned: boolean;
  badges?: string[];
  profile?: Profile;
  children?: React.ReactNode;
  userName?: string;
}

const ProfileAvatar: React.FC<IProfileAvatar> = ({
  size,
  userName,
  badges,
  isMentioned = false,
  profile,
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const { data: hoveredProfile, isLoading } =
    api.user.getUserByUserName.useQuery(
      { username: userName ?? "" },
      { enabled: !!userName && isMentioned && isHovered },
    );

  const avatarSize = size === "LARGE" ? "h-8 w-8" : "h-6 w-6";
  const avatarName = size === "LARGE" ? "flex" : "hidden";

  if (isMentioned && !profile && !userName) {
    throw new Error(
      "When isMentioned is true, either profile or userName must be provided.",
    );
  }

  const displayedProfile =
    (isMentioned && hoveredProfile) || profile || hoveredProfile;

  console.log("hoveredprofile", hoveredProfile);

  const firstLetter = displayedProfile?.display_name?.[0];
  return (
    <HoverCard
      onOpenChange={(open) => {
        setIsHovered(open); // Update hover state
      }}
    >
      <HoverCardTrigger>
        {isMentioned ? (
          <> {children} </>
        ) : (
          <div className="flex items-center gap-2 hover:cursor-pointer">
            <Avatar className={avatarSize}>
              <AvatarImage src={displayedProfile?.pfp_url || ""} />
              <AvatarFallback>{firstLetter}</AvatarFallback>
            </Avatar>
            <div className={avatarName}>{displayedProfile?.display_name}</div>
          </div>
        )}
      </HoverCardTrigger>
      {displayedProfile && (
        <HoverCardContent
          align="center"
          sideOffset={12}
          className=" flex w-96 flex-shrink shadow-lg "
        >
          <ProfileHoverContent {...displayedProfile} />
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

export default ProfileAvatar;

export const ProfileHoverContent: React.FC<Profile> = ({
  pfp_url,
  display_name,
  username,
  following_count,
  follower_count,
  profile,
  tags,
}: Profile) => {
  return (
    <div className="flex w-96 flex-col   gap-3 border-none p-4 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={pfp_url} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col  text-sm">
            <span> {display_name}</span>
            <span> @{username}</span>
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
          <span className="">{following_count} Following</span>
        </div>

        <div className="flex items-center gap-1   text-sm    text-primary/40">
          <span className="">{follower_count} Followers</span>
        </div>
      </div>

      <span className="text-xs text-primary/60"> {profile.bio.text} </span>
      <div className=" flex flex-wrap gap-2 ">
        {tags.map((item) => (
          <Tag {...item} key={item.id} />
        ))}
      </div>
    </div>
  );
};
