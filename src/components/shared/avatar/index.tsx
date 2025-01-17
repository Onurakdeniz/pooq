"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Plus, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { formatDistanceToNow } from "date-fns";
import type { Author } from "@/types";
import { skipToken } from "@tanstack/react-query";

interface IProfileAvatar {
  size: string;
  isMentioned: boolean;
  badges?: string[];
  author?: Author;
  children?: React.ReactNode;
  userName?: string;
  date?: string;
  format: "nameOnly" | "full" | "avatarOnly";
}

const ProfileAvatar: React.FC<IProfileAvatar> = ({
  size,
  userName,
  isMentioned = false,
  author,
  children,
  date,
  format = "full",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const { data: profileData, isLoading } = api.user.getProfileHover.useQuery(
    isHovered && !author && userName ? { userName } : skipToken,
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  );

  const avatarSize = size === "LARGE" ? "h-6 w-6" : "h-6 w-6";
  const avatarName = size === "LARGE" ? "flex text-sm " : "hidden";

  const displayedAuthor = author ?? profileData;
  const firstLetter = displayedAuthor?.displayName?.[0] ?? userName?.[0] ?? '';

  const dateValue = date ? new Date(date) : new Date();
  const isValidDate = !isNaN(dateValue.getTime());

  const formattedTimeAgo = isValidDate
    ? formatDistanceToNow(dateValue, { addSuffix: true }).replace(
        /^about\s/i,
        "",
      )
    : "Invalid date";

  const renderContent = () => {
    switch (format) {
      case "nameOnly":
        return (
          <div className="flex items-center gap-2">
            <Avatar className={avatarSize}>
              <AvatarImage src={displayedAuthor?.pfpUrl} />
              <AvatarFallback>{firstLetter}</AvatarFallback>
            </Avatar>
            <div className={avatarName}>{displayedAuthor?.displayName}</div>
          </div>
        );
      case "full":
        return (
          <div className="flex items-center gap-2">
            <Avatar className={avatarSize}>
              <AvatarImage src={displayedAuthor?.pfpUrl} />
              <AvatarFallback>{firstLetter}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <div className={avatarName}>{displayedAuthor?.displayName}</div>
              <div className={avatarName}>
                <span className="truncate text-xs text-primary/50">
                  @{displayedAuthor?.username}
                </span>
              </div>
              <span className="ml-4 line-clamp-1 text-xs text-primary/50 sm:order-last sm:mb-0">
                {formattedTimeAgo}
              </span>
            </div>
          </div>
        );
      case "avatarOnly":
        return (
          <Avatar className={avatarSize}>
            <AvatarImage src={displayedAuthor?.pfpUrl} />
            <AvatarFallback>{firstLetter}</AvatarFallback>
          </Avatar>
        );
    }
  };

  return (
    <HoverCard onOpenChange={setIsHovered}>
      <HoverCardTrigger className="">
        {isMentioned ? (
          <> {children} </>
        ) : (
          renderContent()
        )}
      </HoverCardTrigger>
      <HoverCardContent
        align="center"
        sideOffset={12}
        className="z-90 relative flex w-96 flex-shrink bg-[#fdfcf5] shadow-lg dark:bg-[#1a1a1a]"
      >
        {isLoading ? (
          <div className="flex w-full items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary/60" />
          </div>
        ) : displayedAuthor ? (
          <ProfileHoverContent author={displayedAuthor} />
        ) : (
          <div className="p-4 text-sm text-primary/60">User not found</div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

interface ProfileHoverContentProps {
  author: Author;
}

const ProfileHoverContent: React.FC<ProfileHoverContentProps> = ({ author }) => {
  const {
    pfpUrl,
    displayName,
    username,
    followingCount,
    followerCount,
    bio,
  } = author;

  return (
    <div className="flex w-96 flex-col gap-3 border-none p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={pfpUrl} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm">
            <span>{displayName}</span>
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
          <span>{followingCount} Following</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-primary/40">
          <span>{followerCount} Followers</span>
        </div>
      </div>
      <span className="text-xs text-primary/60">{bio}</span>
    </div>
  );
};

interface ProfileHoverWrapperProps {
  userName: string;
  children: React.ReactNode;
}

const ProfileHoverWrapper: React.FC<ProfileHoverWrapperProps> = ({
  userName,
  children,
}) => {
  return (
    <ProfileAvatar size="NORMAL" isMentioned userName={userName} format="full">
      {children}
    </ProfileAvatar>
  );
};

export { ProfileAvatar, ProfileHoverWrapper };