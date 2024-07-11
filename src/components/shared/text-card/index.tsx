"use client";

import React from "react";
import StoryHover from "../story-hover";
import ProfileAvatar from "../avatar";
import { HoverStory } from "@/types";
import StoryFooter from "../story-card/footer";
import { api } from "@/trpc/react";

interface TextCardProps {
  storyId?: string[];
  text?: string | null;
  timestamp : string
}

const TextCard: React.FC<TextCardProps> = ({ text, storyId ,timestamp}) => {
  if (!text) {
    return null; // Or you could return a placeholder component
  }

  const parts = text.split(/(@[\w.-]+|<[\w.-]+>)/gi);

  return (
    <div className="flex w-full flex-col font-light text-sm text-primary/70">
      {parts.map((part, index) => {
        if (part.startsWith("@")) {
          const userName = part.substring(1); // Remove @
          return (
            <ProfileAvatar
              key={index}
              size="NORMAL"
              isMentioned
              userName={userName}
              date={timestamp}
            >
              <span className="rounded-md font-semibold text-emerald-400">
                {part}
              </span>
            </ProfileAvatar>
          );
        } else if (part.startsWith("<") && part.endsWith(">")) {
          const storyName = part.slice(1, -1); // Remove < and >
          return (
            <StoryHoverWrapper key={index} storyId={storyName}>
              <span className="rounded-md font-semibold text-emerald-400">
                chk:{storyName}
              </span>
            </StoryHoverWrapper>
          );
        }
        return (
          <span className="flex w-full" key={index}>
            {part}
          </span>
        );
      })}
    </div>
  );
};

interface StoryHoverWrapperProps {
  storyId: string;
  children: React.ReactNode;
}

const StoryHoverWrapper: React.FC<StoryHoverWrapperProps> = ({
  storyId,
  children,
}) => {
   

  return <div> </div>;
};

export default TextCard;