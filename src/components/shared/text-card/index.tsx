"use client";

import React, { useState } from "react";
import type { HoverStory } from "@/types";
import StoryHover from "../story-hover";
import { ProfileHoverWrapper } from "../avatar";
import { api } from "@/trpc/react";
import Link from "next/link";
import { titleToSlug } from "@/lib/helper";

interface TextCardProps {
  text: string | null | undefined;
}

const TextCard: React.FC<TextCardProps> = ({ text }) => {
  const [isHovering, setIsHovering] = useState(false);

  if (!text) {
    return null;
  }

  const parts = text.split(/(#\w+|"[^"]+"|@[\w.-]+)/gi);

     /* eslint-disable */

  const textsToQuery = React.useMemo(() => {
    const words = parts
      .filter((part) => part.startsWith("#"))
      .map((part) => part.substring(1));
    const phrases = parts
      .filter((part) => part.startsWith('"') && part.endsWith('"'))
      .map((part) => part.slice(1, -1));
    return [...words, ...phrases];
  }, [parts]);

     /* eslint-disable */

  const {
    data: hoverStories,
    isLoading,
    isError,
  } = api.story.getMultipleHoverStories.useQuery(
    { texts: textsToQuery },
    {
      enabled: isHovering && textsToQuery.length > 0,
      staleTime: 1000 * 60 * 5,
      retry: 3,
      retryDelay: 1000,
    },
  );

  return (
    <p
      className="text-sm font-light text-primary/70"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {parts.map((part, index) => {
        if (part.startsWith("#")) {
          const word = part.substring(1);
          const story = hoverStories?.find((s: HoverStory) => s.title === word);
          return (
            <StoryHover
              key={index}
              story={story}
              isLoading={isLoading}
              isError={isError}
            >
              {story?.id && story?.title ? (
                <Link
                  href={`/t${titleToSlug(story.title, story.id)}`}
                  passHref
                >
                  <span className="cursor-pointer rounded-md font-semibold text-primary/80">
                    {word}
                  </span>
                </Link>
              ) : (
                <span className="rounded-md font-semibold text-primary/80">
                  {word}
                </span>
              )}
            </StoryHover>
          );
        } else if (part.startsWith('"') && part.endsWith('"')) {
          const phrase = part.slice(1, -1);
          const story = hoverStories?.find(
            (s: HoverStory) => s.title === phrase,
          );
          return (
            <StoryHover
              key={index}
              story={story}
              isLoading={isLoading}
              isError={isError}
            >
              {story?.id && story?.title ? (
                <Link
                  href={`/t${titleToSlug(story.title, story.id)}`}
                  passHref
                >
                  <span className="cursor-pointer rounded-md font-semibold text-primary/80">
                    {phrase}
                  </span>
                </Link>
              ) : (
                <span className="rounded-md font-semibold text-primary/80">
                  {phrase}
                </span>
              )}
            </StoryHover>
          );
        } else if (part.startsWith("@")) {
          const userName = part.substring(1);
          return (
            <ProfileHoverWrapper key={index} userName={userName}>
              <span className="cursor-pointer rounded-md font-bold text-primary/90">
                @{userName}
              </span>
            </ProfileHoverWrapper>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </p>
  );
};

export default TextCard;