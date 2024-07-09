import { api } from "@/trpc/server";
import ProfileTop from "./top";
import Profile from "./profile";
import ProfileHeader from "./feed/header";
import StoryList from "@/app/feed/components/list";
import ProfilePostList from "./post-list";
import ProfileTagList from "./tag-list";
import { Author, PostWithStory, Story, Tag } from "@/types/type";

interface ProfileContentProps {
  userProfile: Author;
  profileFid: number;
  searchParams: {
    tab?: string;
  };
}

// Define a type for the possible tabs
type TabType = "posts" | "tags" | "stories";

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

  const fetchFeedData = async () => {
    switch (feedType) {
      case "POST":
        return await api.story.getPostsWithStoryByUser({ userFid: profileFid });
      case "STORY":
        return await api.story.getStoriesByUser({ userFid: profileFid });
      case "TAG":
        return await api.tag.getParentTagsByUser({ userFid: profileFid });
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

    if (feedType === "STORY" && "items" in feedData && "nextCursor" in feedData) {
      return feedData.items.length > 0 ? (
        <StoryList
          initialStories={feedData.items as Story[]}
          searchParams={searchParams}
          initialCursor={feedData.nextCursor ? String(feedData.nextCursor) : null}
        />
      ) : renderEmptyState();
    }

    if (feedType === "POST" && "items" in feedData && "nextCursor" in feedData) {
      return feedData.items.length > 0 ? (
        <ProfilePostList
          initialPosts={feedData.items as PostWithStory[]}
          searchParams={searchParams}
          initialCursor={feedData.nextCursor ? String(feedData.nextCursor) : null}
        />
      ) : renderEmptyState();
    }

    if (feedType === "TAG" && Array.isArray(feedData)) {
      return feedData.length > 0 ? (
        <ProfileTagList tags={feedData as Tag[]} />
      ) : renderEmptyState();
    }
    
    return renderEmptyState();
  };

  return (
    <div className="z-0 flex min-h-screen flex-col">
      <ProfileTop />
      <Profile data={userProfile} />
      <ProfileHeader />
      {renderFeed()}
    </div>
  );
};

export default ProfileContent;