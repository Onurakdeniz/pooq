// types.ts

export interface Tag {
  name: string;
  id: string;
  followers?: number;
  isFollowed?: boolean;
  description?: string;
}

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

export interface Author {
  numberOfStories: number;
  numberOfPosts: number;
  object: "user";
  username: string;
  fid: number;
  tags?: Tag[];
  custody_address: string;
  display_name: string;
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

export interface Cast {
  parent_author: ParentAuthor;
  hash: string;
  thread_hash: string;
  parent_hash: string | null;
  text: string;
  timestamp: string;
  reactions: Reactions;
  mentioned_profiles: string[];
  viewer_context: CastViewerContext;
}

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
  hash?:string
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



export interface TrendingItem {
  storyId : number
  title : string
  authorFid : number
  numberOfPosts : number 
}
