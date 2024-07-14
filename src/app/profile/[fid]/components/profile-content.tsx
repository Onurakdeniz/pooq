import { api } from "@/trpc/server";
import ProfileTop from "./top";
import Profile from "./profile";
import ProfileHeader from "./feed/header";
import StoryList from "@/app/feed/components/list";
import ProfilePostList from "./post-list";
import ProfileTagList from "./tag-list";
import { Author, Post, PostWithStory, Story, Tag } from "@/types";

interface ProfileContentProps {
  userProfile: Author;
  profileFid: number;
  searchParams: {
    tab?: string;
  };
}

type TabType = "posts" | "tags" | "stories";

interface StoryFeedData {
  items: (Story & { posts: Post[] })[];
  nextCursor: number | null;
}

interface PostFeedData {
  items: PostWithStory[];
  nextCursor: string | null;  
}

const ProfileContent = async ({
  userProfile,
  profileFid,
  searchParams,
}: ProfileContentProps) => {
  const tab = (searchParams.tab?.toLowerCase() ?? "stories") as TabType;  
  
  const feedTypeMap: Record<TabType, string> = {
    posts: "POST",
    tags: "TAG",
    stories: "STORY",
  };

  const feedType = feedTypeMap[tab] || "STORY";

  const fetchFeedData = async (): Promise<StoryFeedData | PostFeedData | Tag[] | null> => {
    switch (feedType) {
      case "POST":
        return await api.story.getPostsWithStoryByUser({ userFid: profileFid }) as PostFeedData;
      case "STORY":
        return await api.story.getStoriesByUser({ userFid: profileFid }) as StoryFeedData;
      case "TAG":
 
      default:
        return null;
    }
  };

  const feedData = await fetchFeedData();

  const renderEmptyState = () => (
    <div className="flex items-center justify-center h-64">
      <p className="text-primary/50 text-lg mt-20">No {tab} available</p>
    </div>
  );

  const renderFeed = () => {
    if (!feedData) return renderEmptyState();

    if (feedType === "STORY" && 'items' in feedData && 'nextCursor' in feedData) {
      const storyFeedData = feedData as StoryFeedData;
      return storyFeedData.items.length > 0 ? (
        <StoryList
          initialStories={storyFeedData.items}
          searchParams={searchParams}
          initialCursor={(storyFeedData.nextCursor)}
          isProfile={true}
 
        />
      ) : renderEmptyState();
    }

    if (feedType === "POST" && 'items' in feedData && 'nextCursor' in feedData) {
      const postFeedData = feedData as PostFeedData;
      return postFeedData.items.length > 0 ? (
        <ProfilePostList
          initialPosts={postFeedData.items}
          searchParams={searchParams}
          initialCursor={postFeedData.nextCursor}
        />
      ) : renderEmptyState();
    }

    if (feedType === "TAG" && Array.isArray(feedData)) {
      return feedData.length > 0 ? (
        <div></div>
      ) : renderEmptyState();
    }
    
    return renderEmptyState();
  };

  return (
    <div className="z-0 flex min-h-screen flex-col">
      <ProfileTop />
      <Profile author={userProfile} />
      <ProfileHeader />
      {renderFeed()}
    </div>
  );
};

export default ProfileContent;