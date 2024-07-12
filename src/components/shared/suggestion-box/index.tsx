import React from "react";
import Link from "next/link";
import SuggestionBoxHeader from "./header";
import SuggestionBoxFooter from "./footer";
import { SUGGESTION_BOX_TYPES } from "@/lib/constants";
import { titleToSlug } from "@/lib/helper";

interface SuggestedItemProps {
  id: string;
  name?: string;
  username?: string;
  image?: string;
  title?: string;
  tag?: string;
}

interface ISuggestionBox {
  type: "USER" | "TAG" | "STORY";
  suggestions: SuggestedItemProps[];
}

const StoryItem: React.FC<SuggestedItemProps> = ({ id, title }) => (
  <Link href={`/t${titleToSlug(title!, parseFloat(id))}`} passHref>
    <div className="p-2 text-sm font-semibold text-primary/70">{title}</div>
  </Link>
);

const UserItem: React.FC<SuggestedItemProps> = ({
  id,
  name,
  username,
  image,
}) => (
  <Link
    href={`/profile/${id}`}
    className="flex w-full items-center rounded-xl p-2 hover:bg-accent"
  >
    <img
      src={image}
      alt={name}
      className="mr-2 h-8 w-8 rounded-full object-cover"
    />
    <div>
      <div className="text-sm font-semibold">{name}</div>
      <div className="text-xs text-primary/60">@{username}</div>
    </div>
  </Link>
);

const TagItem: React.FC<SuggestedItemProps> = ({ tag }) => (
  <Link
    href={`/tag/${tag}`}
    className="flex w-full rounded-xl p-2 hover:bg-accent"
  >
    <div className="p-2 text-sm font-semibold text-primary/70">#{tag}</div>
  </Link>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex w-full rounded-xl p-2 hover:bg-accent">
    <div className="p-2 text-sm font-semibold text-primary/70">{message}</div>
  </div>
);

const SuggestionBox: React.FC<ISuggestionBox> = ({ type, suggestions }) => {
  const { title, Icon, info } = SUGGESTION_BOX_TYPES[type];

  const renderItem = (item: SuggestedItemProps) => {
    switch (type) {
      case "STORY":
        return <StoryItem key={item.id} {...item} />;
      case "USER":
        return <UserItem key={item.id} {...item} />;
      case "TAG":
        return <TagItem key={item.id} {...item} />;
      default:
        return null;
    }
  };

  const emptyStateMessage = {
    USER: "We need more registered users to suggest users.",
    TAG: "No tags available at the moment.",
    STORY: "No stories available at the moment.",
  }[type];

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-2">
      <SuggestionBoxHeader title={title} Icon={Icon} info={info} />
      <div className="flex w-full flex-col ">
        {suggestions && suggestions.length > 0 ? (
          suggestions.map(renderItem)
        ) : (
          <EmptyState message={emptyStateMessage} />
        )}
      </div>
      <SuggestionBoxFooter />
    </div>
  );
};

export default SuggestionBox;
