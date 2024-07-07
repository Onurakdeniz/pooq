// types.ts

export type Tag = {
  id: string;
  name: string;
  followers?: number;
  isFollowed?: boolean;
  description?: string;
  parentTagId?: string | null;
};

export type Entity = {
  id: string;
  name: string;
  description?: string;
  type?: string;
};

export interface Bio {
  text: string;
}

export interface Profile {
  bio: Bio;
}

export interface VerifiedAddresses {
  eth_addresses: string[];
  sol_addresses: string[];
}

export interface AuthorViewerContext {
  following: boolean;
  followed_by: boolean;
}

export interface CastViewerContext {
  liked: boolean;
  recasted: boolean;
}

export interface ParentAuthor {
  fid: number | null;
}

export interface ReactionUser {
  fid: number;
  fname: string;
}

export interface Reactions {
  likes_count: number;
  recasts_count: number;
  likes: ReactionUser[];
  recasts: ReactionUser[];
}


export type ParentTags = {
  id: string;
  name: string;
  followers?: number;
  isFollowed?: boolean;
  description?: string;
  parentTagId?: string | null;
};


export interface Author {
  numberOfStories?: number;
  numberOfPosts?: number;
  object: "user";
  username: string;
  fid: number;
  parentTags?: ParentTags[];  
  custody_address: string;
  display_name?: string;
  pfp_url: string;
  profile: Profile;
  follower_count: number;
  following_count: number;
  verifications: string[];
  verified_addresses: VerifiedAddresses;
  active_status: string;
  power_badge: boolean;
  viewer_context: AuthorViewerContext;
}
type MentionedProfile = string | { fid: number; username: string };


export interface Cast  {
  parent_author: ParentAuthor;
  hash: string;
  thread_hash: string;
  parent_hash: string | null;
  text: string;
  replies: { count: number };
  timestamp: string;
  reactions: {
    likes_count: number;
    recasts_count: number;
    likes: ReactionUser[];
    recasts: ReactionUser[];
  };
  mentioned_profiles?: MentionedProfile[]
  viewer_context: CastViewerContext;
};

export interface TagStory {
  id: string;
  name: string;
}

export interface EntityStory {
  id: string;
  name: string;
}

export interface CategoryStory {
  id: string;
  name: string;
}

export interface Story {
  id: string;
  hash?: string;
  title: string;
  type: "FEED" | "STORY";
  tags: TagStory[];
  entities: EntityStory[];
  categories: CategoryStory[];
  isBookmarked: boolean;
  mentionedStories: string[];
  numberofPosts: number;
  author: Author;
  cast: Cast;
}

export type OptionalStory = Partial<Story>;

export interface StoriesResponse {
  items: Story[];
  nextCursor: string | null;
}

export interface Post {
  id: string;
  hash: string;
  tags: Tag[];
  entities: Entity[];
  isBookmarkedByUser: boolean;
  author: Author;
  cast: Cast;
  isLikedByUser: boolean;
  text: string;
}

export interface PostWithStory extends Post {
  storyTitle: string;
  storyId: string;
}

export interface TrendingItem {
  storyId: number;
  title: string;
  authorFid: number;
  numberOfPosts: number;
}
