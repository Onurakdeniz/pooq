'use client'
import { StoryPost } from "@/components/shared/post-card";
import React from "react";
import { Post as IPost } from "@/types";
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
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<PostSkeleton />}
      scrollThreshold="100px"
    >
      <div className="flex flex-col py-4">
        {posts.map((post) => (
          <StoryPost {...post} key={post.id} /> 
        ))}
      </div>
    </InfiniteScroll>
  );
};

const PostSkeleton: React.FC = () => (
  <div className="p-8 space-y-4 border-b">
    <div className="flex items-center space-x-2">
      <Skeleton className="w-10 h-10 rounded-full" />
      <Skeleton className="h-4 w-1/4" />
    </div>
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-40 w-full rounded-2xl" />
   
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