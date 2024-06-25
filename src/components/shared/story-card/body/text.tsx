import React from "react";
import StoryHover from "../../story-hover";

interface StoryTextProps {
  text: string;
  tokenPattern: string;
  hoverCardContent?: (token: string) => React.ReactNode;
}

const StoryText: React.FC<StoryTextProps> = ({ 
  text, 
  tokenPattern, 
 
  hoverCardContent = (token) => `Hover content for ${token}` 
}) => {
  const parts = text.split(tokenPattern);
  const matches = text.match(tokenPattern);
  const storyTitle = "Token Airdrop"
  return (
    <p style={{ display: 'inline' }}>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {matches && matches[index] && (
            <StoryHover
              storyId={matches[index]}
              content={hoverCardContent(matches[index])}
            >
              <span className=" font-semibold rounded-md" style={{ whiteSpace: 'nowrap', display: 'inline' }}>
                {storyTitle}
              </span>
            </StoryHover>
          )}
        </React.Fragment>
      ))}
    </p>
  );
};

export default StoryText;