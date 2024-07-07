import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
 
import { Post, PostWithStory } from "@/types/type"; // Assuming you have a Post type defined
import { InfiniteScrollPostList } from "./post-infinite"; // We'll create this next

interface ProfilePostListProps {
  initialPosts: PostWithStory[];
  searchParams: Record<string, string | string[] | undefined>;
  initialCursor: string | null;
}
const ProfilePostList = ({ initialPosts, searchParams, initialCursor }: ProfilePostListProps) => {
  return (
    <ScrollArea className="flex flex-col">
      <div className="flex flex-col">
        <InfiniteScrollPostList 
          initialPosts={initialPosts} 
          searchParams={searchParams} 
          initialCursor={initialCursor} 
        />
      </div>
    </ScrollArea>
  );
};

export default ProfilePostList;