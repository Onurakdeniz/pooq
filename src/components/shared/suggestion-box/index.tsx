import React from "react";
import SuggestionBoxHeader from "./header";
import SuggestionBoxFooter from "./footer";
import { SUGGESTION_BOX_TYPES } from "@/lib/constants";
import Link from "next/link";

interface SuggestedItemProps {
  id: string;
  name?: string;
  username?: string;
  image?: string;
  title?: string;
}

interface ISuggestionBox {
  type: "USER" | "TAG" | "STORY";
  suggestions: SuggestedItemProps[];
}

const StoryItem: React.FC<SuggestedItemProps> = ({ id, title }) => {
  return (
    <Link href={`/story/${id}`} className="rounded-xl p-2 flex w-full hover:bg-accent">
      <div className="text-sm text-primary/70 font-semibold p-2">{title}</div>
    </Link>
  );
};

const UserItem: React.FC<SuggestedItemProps> = ({ id, name, username, image }) => {
  return (
    <Link href={`/profile/${id}`} className="rounded-xl p-2 flex w-full hover:bg-accent">
      <img src={image} alt={name} className="w-8 h-8 rounded-full mr-2" />
      <div>
        <div className="text-sm font-semibold">{name}</div>
        <div className="text-xs text-primary/60">@{username}</div>
      </div>
    </Link>
  );
};

const SuggestionBox: React.FC<ISuggestionBox> = ({ type, suggestions }) => {
  const { title, Icon, info } = SUGGESTION_BOX_TYPES[type];
  return (
    <div className="flex flex-col gap-4 rounded-lg border p-2">
      <SuggestionBoxHeader title={title} Icon={Icon} info={info} />
      {suggestions && suggestions.length > 0 ? (
        <div className="flex flex-col gap-2 w-full">
          {suggestions.map((item) => (
            type === "STORY" ? (
              <StoryItem key={item.id} {...item} />
            ) : (
              <UserItem key={item.id} {...item} />
            )
          ))}
        </div>
      ) : (
        <div className="flex items-center py-4 text-sm text-primary/60">
          We need more registered users to suggest you users.
        </div>
      )}
      <SuggestionBoxFooter />
    </div>
  );
};

export default SuggestionBox;