import React from "react";
import StoryHeader from "./header";
import StoryBody from "./body";
import StoryFooter from "./footer";
import StoryHover from "../story-hover";
import TextCard from "../text-card";
import { Story } from "@/types/index";

const StoryCard: React.FC<Story> = ({
  title,
  tags,
  entities,
  isBookmarked,
  mentionedStories,
  author,
  cast,
}) => {
  return (
    <div className="flex flex-col gap-2 border-b p-8 hover:cursor-pointer hover:bg-accent">
      <div className="flex flex-col gap-2">
        <StoryHeader title={title} tags={tags} author={author} />

        <div>
          <span className="flex text-sm text-primary/60">
            <TextCard text={cast.text} storyId={mentionedStories} />
          </span>
        </div>
      </div>
      <StoryFooter />
    </div>
  );
};

export default StoryCard;
