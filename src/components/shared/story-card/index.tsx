import React from "react";
import StoryHeader from "./header";
import StoryBody from "./body";
import StoryFooter from "./footer";
import StoryHover from "../story-hover";
import TextCard from "../text-card";
import { Story as IStory } from "@/types/type";
 

const StoryCard: React.FC<IStory> = ({
  id,
  title,
  tags,
  entities,
  isBookmarked,
  mentionedStories,
  author,
  cast,
  numberofPosts,
  type,
}) => {
  return (
    <div className="flex w-full  flex-col border-b p-8 hover:cursor-pointer hover:bg-accent">

      <div className="flex w-full  flex-col  gap-2">
        <StoryHeader
        id={id}
          title={title}
          numberOfLikes={cast.reactions.likes_count}
          author={author}
          date={cast.timestamp}
        />

        <div className="flex w-full text-sm text-primary/60">
          <TextCard text={cast.text} storyId={mentionedStories} tags={tags} numberofPosts={numberofPosts} />
        </div>
      </div>
   
    </div>
  );
};

export default StoryCard;
