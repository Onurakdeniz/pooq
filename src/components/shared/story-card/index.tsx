import React from "react";
import StoryHeader from "./header";
import StoryBody from "./body";
import StoryFooter from "./footer";
import StoryHover from "../story-hover";
import TextCard from "../text-card";
import { Story as IStory } from "@/server/api/routers/story";
 
const StoryCard: React.FC<IStory> = ({
  title,
  tags,
  entities,
  isBookmarked,
  mentionedStories,
  author,
  cast,
}) => {
  const numberofPosts = cast.direct_replies.length;
  return (
    <div className="flex flex-col  w-full border-b p-8 hover:cursor-pointer hover:bg-accent">
      <div className="flex flex-col  w-full  gap-2">
        <StoryHeader
          title={title}
          tags={tags}
          author={author}
          date={cast.timestamp}
        />

    
          <div className="flex text-sm w-full text-primary/60">
            <TextCard text={cast.text} storyId={mentionedStories} tags={tags} />
          </div>
  
   
      </div>
  
    </div>
  );
};

export default StoryCard;
