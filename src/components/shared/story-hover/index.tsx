"use client";

import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { HoverStory } from "@/types";
import { storyTypeIcons, storyTypeTooltips } from "@/lib/constants";
import { StoryType } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StoryHoverProps {
  story?: HoverStory;
  isLoading: boolean;
  isError: boolean;
  children: React.ReactNode;
}

const StoryHover: React.FC<StoryHoverProps> = ({ story, isLoading, isError, children }) => {
  const handleCreateStory = () => {
    // Implement story creation logic here
    console.log("Create story for:", story?.text);
  };

  const renderIcon = (type: StoryType | null | undefined) => {
    const IconComponent = type ? storyTypeIcons[type] : null;

    if (IconComponent) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-200 p-1.5 dark:border-emerald-950">
                <IconComponent className="text-emerald-600" strokeWidth={1.5} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{type && storyTypeTooltips[type]}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return null;
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        align="center"
        sideOffset={12}
        className="flex flex-col gap-4 min-w-[8rem] max-w-96"
      >
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error loading story data</div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold overflow-hidden">
                  {renderIcon(story?.type as StoryType)}
                  <span className="truncate">
                    {story ? story.title : children}
                  </span>
                </div>
                {story ? (
                  <Button
                    className="flex h-6 w-20 text-xs justify-between px-3 text-primary/60 shadow-none ml-2 flex-shrink-0"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Bookmark</span>
                  </Button>
                ) : (
                  <Button
                    className="flex h-6 w-24 justify-between px-3 text-primary/60 shadow-none ml-2 flex-shrink-0"
                    variant="outline"
                    onClick={handleCreateStory}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create</span>
                  </Button>
                )}
              </div>
              {story && (
                <div className="flex items-center gap-1 text-xs text-primary/40">
                  <FileText className="h-4 w-4" />
                  <span>{story.numberOfPosts} posts</span>
                </div>
              )}
            </div>
            {story ? (
              <span className="text-xs text-primary/60">
                {story.description ?? "No description available."}
              </span>
            ) : (
              <span className="text-xs text-primary/60">
                Do you want to create this story?
              </span>
            )}
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default StoryHover;