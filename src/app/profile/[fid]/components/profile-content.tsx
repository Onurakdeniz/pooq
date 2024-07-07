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

  const renderFeed = () => {
    if (!feedData) return null;

    if (feedType === "STORY" && "items" in feedData && "nextCursor" in feedData) {
      return (
        <StoryList
          initialStories={feedData.items as Story[]}
          searchParams={searchParams}
          initialCursor={feedData.nextCursor ? String(feedData.nextCursor) : null}
        />
      );
    }

    if (feedType === "POST" && "items" in feedData && "nextCursor" in feedData) {
      return (
        <ProfilePostList
          initialPosts={feedData.items as PostWithStory[]}
          searchParams={searchParams}
          initialCursor={feedData.nextCursor ? String(feedData.nextCursor) : null}
        />
      );
    }

    if (feedType === "TAG" && Array.isArray(feedData)) {
      return <div> </div>;
    }

    return null;
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