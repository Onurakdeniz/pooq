export type Tag = {
  id: string;
  name: string;
  followers?: number;
  isFollowed: boolean;
  description: string;
};

export type Entity = {
  id: string;
  name: string;
  description: string;
  type: string;
};


///////// FEED //////////


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
  
  export type Author = {
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
  };


  
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

  export enum CastType {
    // Define your cast types here, for example:
    POST = 'POST',
    STORY = 'STORY',
 
 
  }

  export interface TagStory {
    id : string,
    name : string
  }

  export interface EntityStory {
    id : string,
    name : string
  }

  export interface CategoryStory {
    id : string,
    name : string
  }
  
  export interface Story {
    id: string;
    title: string;
    type: CastType;
    tags: TagStory[];
    entities: EntityStory[];
    categories: CategoryStory[];
    isBookmarked: boolean;
    mentionedStories: string[];
    numberofPosts: number;
    author: Author;
    cast: Cast;
  }
  // If you need a type that represents an optional Story (e.g., for API responses)
  type OptionalStory = Partial<Story>;
  
  // Type for the API response
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
  ///////// FEED //////////