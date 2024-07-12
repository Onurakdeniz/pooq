"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SuggestionBox from "@/components/shared/suggestion-box";
import { cn } from "@/lib/utils";
import Profile from "../header/profile";
import { getSimilarStories } from "@/lib/getSimilarStories";
import { api } from "@/trpc/react";

interface RightSideProps {
  className?: string;
}

interface SimilarStory {
  id: number;
  title: string;
}

interface UserSuggestion {
  id: string;
  name: string;
  username: string;
  // Add other properties as needed
}

interface SuggestedItemProps {
  id: string;
  name: string;
  username: string;
  image: string;
}

interface StoryItemProps {
  id: string;
  title: string;
}

type SuggestionType = SuggestedItemProps | StoryItemProps;

export const RightSide: React.FC<RightSideProps> = ({ className }) => {
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);
  const [isStoryPage, setIsStoryPage] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const fetchSuggestions = async () => {
      const isStory = pathname.startsWith("/story/");
      setIsStoryPage(isStory);
      const ids = isStory && pathname.split("/")[2] 
      ? (pathname.split("/")[2], 10) 
      : null;
 
      try {
        if (isStory && ids) {
          const similarStories: SimilarStory[] = await getSimilarStories(ids);
          setSuggestions(
            similarStories.map((story) => ({
              id: story.id.toString(),
              title: story.title,
            }))
          );
        } else {
          // Use the useQuery hook to fetch user suggestions
          const { data: userSuggestions } = api.user.getUserSuggestions.useQuery();
          if (userSuggestions) {
            setSuggestions(
              userSuggestions.map((user) => ({
                id: user.fid.toString(),
                name: user.displayName || user.username,
                username: user.username,
                image: user.pfpUrl || "default-image-url",
              }))
            );
          }
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    };
  
    fetchSuggestions().catch((error) => {
      console.error("Error in fetchSuggestions:", error);
    });
  }, [pathname]);

  return (
    <div
      className={cn("text-white-500 flex w-full flex-col gap-4 p-4", className)}
    >
      <Profile />
      <SuggestionBox
        type={isStoryPage ? "STORY" : "USER"}
        suggestions={suggestions}
      />
    </div>
  );
};

export default RightSide;
