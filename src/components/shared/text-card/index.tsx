'use client'

import React from "react";
import StoryHover from "../story-hover";
import ProfileAvatar from "../avatar";
import { Tag as Itag, HoverStory } from "@/types";
import Tag from "../tag";
import StoryFooter from "../story-card/footer";
import { api } from "@/trpc/react";

interface TextCardProps {
  storyId?: string[];
  text: string;
  tags: Itag[];
}

const TextCard: React.FC<TextCardProps> = ({ text, storyId, tags }) => {
  const parts = text.split(/(@[\w.-]+|<[\w.-]+>)/gi);

  return (
    <div className="flex-col flex  w-full font-light text-primary/70">
      {parts.map((part, index) => {
        if (part.startsWith("@")) {
          const userName = part.substring(1); // Remove @
          return (
            <ProfileAvatar
              key={index}
              size="NORMAL"
              isMentioned
              userName={userName}
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
        return <span className="mb-4 flex w-full" key={index}>{part}</span>;
      })}
      <div className="flex justify-between w-full items-center">
        {tags.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            {tags.map((item) => (
              <Tag {...item} key={item.id} />
            ))}
          </div>
        )}
        <StoryFooter numberofPosts={23} /> 
      </div>
    </div>
  );
};

interface StoryHoverWrapperProps {
  storyId: string;
  children: React.ReactNode;
}

const StoryHoverWrapper: React.FC<StoryHoverWrapperProps> = ({ storyId, children }) => {
  const { data: hoverStory, isLoading, error } = api.story.getHoverStory.useQuery({ storyId });

  if (isLoading) return <span>Loading...</span>;
  if (error) return <span>Error: {error.message}</span>;
  if (!hoverStory) return <span>{children}</span>;

  return (
    <StoryHover hoverStory={hoverStory}>
      {children}
    </StoryHover>
  );
};

export default TextCard;