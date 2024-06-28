"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Tag from "../tag";
import { api } from "@/trpc/react";
import { formatDistanceToNow } from 'date-fns';
import type { UserWithStories as Profile, Tag as ITag } from "@/types";

interface IProfileAvatar {
  size: string;
  isMentioned: boolean;
  badges?: string[];
  profile: Profile;
  children?: React.ReactNode;
  userName?: string;
  date?: string;
}

const ProfileAvatar: React.FC<IProfileAvatar> = ({
  size,
  userName,
  isMentioned = false,
  profile,
  children,
  date
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const { data: hoveredProfile } = api.user.getUserByUserName.useQuery<Profile | null>(
    { username: userName ?? "" },
    { enabled: !!userName && isMentioned && isHovered }
  );

  const avatarSize = size === "LARGE" ? "h-6 w-6" : "h-6 w-6";
  const avatarName = size === "LARGE" ? "flex text-sm " : "hidden";

  // Change this line
  const displayedProfile: Profile | undefined = isMentioned ? hoveredProfile ?? profile : profile;
  const firstLetter = displayedProfile?.display_name?.[0] ?? '';

  const formattedTimeAgo = formatDistanceToNow(
    new Date(date ?? Date.now()),
    { addSuffix: true }
  ).replace(/^about\s/i, '');

  console.log(formattedTimeAgo);

  return (
    <HoverCard onOpenChange={open => setIsHovered(open)}>
      <HoverCardTrigger className="">
        {isMentioned ? (
          <> {children} </>
        ) : (
          <div className="flex items-center gap-2 hover:cursor-pointer">
            <Avatar className={avatarSize}>
              <AvatarImage src={displayedProfile?.pfp_url ?? ""} />
              <AvatarFallback>{firstLetter}</AvatarFallback>
            </Avatar>
            <div className="flex gap-2 items-center">
              <div className={avatarName}>{displayedProfile?.display_name}</div>
              <div className={avatarName}>
                <span className="text-xs text-primary/50 truncate">
                  @{displayedProfile?.username}
                </span>
              </div>
              <span className="ml-4 line-clamp-1 text-xs text-primary/50 sm:order-last sm:mb-0">
                {formattedTimeAgo}
              </span>
            </div>
          </div>
        )}
      </HoverCardTrigger>
      {displayedProfile && (
        <HoverCardContent
          align="center"
          sideOffset={12}
          className="flex relative dark:bg-[#1a1a1a] bg-[#fdfcf5] z-90 w-96 flex-shrink shadow-lg"
        >
          <ProfileHoverContent {...displayedProfile} />
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

export default ProfileAvatar;

type UserWithStories = {
  pfp_url: string;
  display_name: string;
  username: string;
  following_count: number;
  follower_count: number;
  profile: {
    bio: {
      text: string;
    };
  };
  tags: ITag[];
};

const ProfileHoverContent: React.FC<UserWithStories> = ({
  pfp_url,
  display_name,
  username,
  following_count,
  follower_count,
  profile,
  tags,
}) => {
  return (
    <div className="flex w-96 flex-col gap-3 border-none p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={pfp_url} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm">
            <span>{display_name}</span>
            <span>@{username}</span>
          </div>
        </div>
        <Button
          className="flex h-6 w-24 justify-between gap-2 px-3 text-primary/60 shadow-none"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          <span>Follow</span>
        </Button>
      </div>
      <div className="flex gap-3">
        <div className="flex items-baseline gap-1 text-sm text-primary/40">
          <span>{following_count} Following</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-primary/40">
          <span>{follower_count} Followers</span>
        </div>
      </div>
      <span className="text-xs text-primary/60">{profile.bio.text}</span>
      <div className="flex flex-wrap gap-2">
        {tags?.map((tag) => (
          <Tag key={tag.id} {...tag} />
        ))}
      </div>
    </div>
  );
};