import React, { useState } from "react";
import StoryHeader from "./header";
import TextCard from "../text-card";
import { Story  } from "@/types/";
import Tag from "../tag";
import StoryFooter from "./footer";
import { Separator } from "@/components/ui/separator";
 

type CardType = 'FEED' | 'STORY';

interface StoryCardProps extends Story {
  cardType: CardType;
}

const StoryCard: React.FC<StoryCardProps> = ({
  id,
  title,
  hash,
  description,
  view,
  type,
  tags,
  entities,
  timestamp,
  isBookmarkedByUserId,
  author,
  categories,
  isLikedBuUserFid,
  numberOfPosts,
  numberOfLikes,
cardType
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full p-8 border-b ">
      <div className="flex w-full flex-col gap-4">
        <StoryHeader
          id={id}
          title={title}
          numberOfLikes={numberOfLikes}
          author={author}
          timestamp={timestamp}
          isBookmarked={isBookmarkedByUserId}
          isLikedBuUserFid={isLikedBuUserFid}
          type={type}
          cardType={cardType}
        />
        
        <div className="rounded-xl bg-accent px-6 py-4 shadow-sm  ">
    
          <TextCard     timestamp={timestamp} text={description}  />
        </div>
      
        <Separator className="m-0 p-0" />
        

        <div className="flex flex-col gap-2     ">
          <div className="text-sm text-primary/40 font-semibold">Creator Opinion</div>
          <TextCard     timestamp={timestamp}text={view}   />
        </div>
        <div className="flex w-full items-center justify-between">
          {tags.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              {tags.map((item) => (
                <Tag {...item} key={item.id} />
              ))}
            </div>
          )}
          <StoryFooter numberOfPosts={numberOfPosts} />
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
