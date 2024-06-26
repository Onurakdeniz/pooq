import React from "react";
import StoryHover from "../story-hover";
import ProfileAvatar from "../avatar";
import { Badge } from "@/components/ui/badge";

interface TextCardProps {
  storyId?: string[];
  text: string;
}

const TextCard: React.FC<TextCardProps> = ({ text, storyId }) => {
  const parts = text.split(/(@[\w.-]+|<[\w.-]+>)/gi);

  return (
    <p style={{ display: 'inline' }}>
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
              <span
                className="rounded-md font-semibold text-emerald-400"
                style={{ display: "inline" }}
              >
                {part}
              </span>
            </ProfileAvatar>
          );
        } else if (part.startsWith("<") && part.endsWith(">")) {
          const storyName = part.slice(1, -1); // Remove < and >
          return (
            <StoryHover
              key={index}
              storyId={storyName}
              content={`Hover content for ${storyName}`}
            >
              <span
                className="rounded-md font-semibold text-emerald-400"
                style={{ display: "inline" }}
              >
                chk:{storyName}
              </span>
            </StoryHover>
          );
        }
        return <span key={index} style={{ display: "inline" }}>{part}</span>;
      })}
    </p>
  );
};

export default TextCard;