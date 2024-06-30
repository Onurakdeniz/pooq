"use client";
import Post from "@/components/shared/post-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { Post as IPost } from "@/types/type";
import { type TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "@/server/api/root";

interface PostListProps {
  posts: IPost[];
  isLoading: boolean;
  error: TRPCClientErrorLike<AppRouter> | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  isLoading,
  error,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}) => {
  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading && posts.length === 0) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ScrollArea className="flex h-screen">
      <div className="flex flex-col ">
        {posts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
        {hasNextPage && (
          <button
            onClick={loadMore}
            disabled={isFetchingNextPage}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
          >
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </button>
        )}
      </div>
    </ScrollArea>
  );
};

export default PostList;
