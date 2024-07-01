'use client'
import Post from "@/components/shared/post-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { Post as IPost } from "@/types/type";
import { type TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from '@/server/api/root';
import InfiniteScroll from "react-infinite-scroll-component";
import { Skeleton } from "@/components/ui/skeleton";

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
  if (isLoading && posts.length === 0) {
    return <PostListSkeleton />;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  return (
    <ScrollArea className="h-screen">
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<PostSkeleton />}
        scrollableTarget="scrollableDiv"
        endMessage={
          <p className="text-center text-gray-500 my-4">
            No more posts to load.
          </p>
        }
      >
        <div className="flex flex-col">
          {posts.map((post) => (
            <Post key={post.id} {...post} />
          ))}
        </div>
      </InfiniteScroll>
    </ScrollArea>
  );
};

const PostSkeleton: React.FC = () => (
  <div className="p-4 space-y-4 border-b">
    <div className="flex items-center space-x-2">
      <Skeleton className="w-10 h-10 rounded-full" />
      <Skeleton className="h-4 w-1/4" />
    </div>
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-40 w-full rounded" />
    <div className="flex justify-between">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-20" />
    </div>
  </div>
);

const PostListSkeleton: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }, (_, index) => (
      <PostSkeleton key={index} />
    ))}
  </div>
);

export default PostList;