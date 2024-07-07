import React, { useState } from "react";
import StoryHeader from "./header";
import TextCard from "../text-card";
import { Story as IStory } from "@/types/type";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import Tag from "../tag";
import StoryFooter from "./footer";

const StoryCard: React.FC<IStory> = ({
  id,
  title,
  hash,
  tags,
  entities,
  isBookmarked,
  mentionedStories,
  author,
  cast,
  numberofPosts,
  type,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full border-b p-8  ">
 
        <div className="flex w-full flex-col gap-4">
          <StoryHeader
            id={id}
            title={title}
            numberOfLikes={cast.reactions.likes_count}
            author={author}
            date={cast.timestamp}
            isBookmarked={isBookmarked}
            type={type}
            viewer_context={cast.viewer_context}
          />
          <div className="flex w-full items-center justify-between">
            {tags.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                {tags.map((item) => (
                  <Tag {...item} key={item.id} />
                ))}
              </div>
            )}
            <StoryFooter numberofPosts={numberofPosts} />
          </div>
          <div className="  shadow-sm bg-accent rounded-2xl p-6">
            <TextCard text={cast.text} storyId={mentionedStories} />
          </div>
        </div>
 
    
    </div>
  );
};

export default StoryCard;
