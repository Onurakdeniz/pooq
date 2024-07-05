import React from "react";
import SuggestionBoxHeader from "./header";
import SuggestionList from "./body";
import SuggestionBoxFooter from "./footer";
import { SUGGESTION_BOX_TYPES } from "@/lib/constants";
import { SuggestedItemProps } from "./item";

interface ISuggestionBox {
  type: "USER" | "TAG" | "STORY";
  items?: SuggestedItemProps[] | StoryItemProps[];
}

const SuggestionBox = ({ type, items }: ISuggestionBox) => {
  const { title, Icon, info } = SUGGESTION_BOX_TYPES[type];
  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <SuggestionBoxHeader title={title} Icon={Icon} info={info} />
      {type === "STORY" ? (
        <div className="flex flex-col gap-2">
          {(items as StoryItemProps[]).map((item) => (
            <StoryItem key={item.id} {...item} />
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

import Link from "next/link";
import { UserPlus } from "lucide-react";

export interface StoryItemProps {
  id: string;
  title: string;
}

const StoryItem: React.FC<StoryItemProps> = ({ id, title }) => {
  return (
    <Link href={`/story/${id}`} className=" rounded-xl p-2 hover:bg-accent">
      <div className="text-sm   ">{title}</div>
    </Link>
  );
};
