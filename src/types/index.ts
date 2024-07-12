import { StoryType } from "@prisma/client";
export interface Entity {
  id: string;
  name: string;
  description?: string;

}

export interface Category {
  id: string;
  name: string;
  description?: string;

}

 
export interface Tag {
    id: string;
    name: string;
    description?: string;
 
  }
  
export interface ReferenceStory {
  id: string;
  referenceText: string;
  storyTitle: string;
}

export interface ReferenceUser {
  id: string;
  referenceText: string;
  fid: number;
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

export interface VerifiedAddresses {
  eth_addresses: string[];
  sol_addresses: string[];
}

export interface AuthorViewerContext {
  following: boolean;
  followed_by: boolean;
}

export interface Author {
  username: string;
  isUser: boolean;
  fid: number;
  displayName: string;
  pfpUrl: string;
  custodyAddress: string;
  followerCount: number;
  followingCount: number;
  verifications: string[];
  activeStatus: string;
  powerBadge: boolean;
  viewerContent: AuthorViewerContext;
  numberOfStories: number;
  numberOfPosts: number;
  isRegistered: boolean;
  bio: string;
}

export interface Story {
  id: number;
  hash: string;
  text: string;
  title?: string;
  view?: string | null;
  type?: StoryType | null;
  description?: string | null;
  timestamp: string;
  isBookmarkedByUserId: boolean;
  isLikedBuUserFid: boolean;
  author: Author;
  tags: Tag[];
  entities: Entity[];
  categories: Category[];
  numberOfPosts? : number //implement
  numberOfLikes : number  
}

export interface Post {
  id: string;
  hash: string;
  tags: Tag[];
  entities: Entity[];
  isBookmarkedByUserId: boolean;
  author: Author;
  timestamp: string;
  isLikedBuUserFid: boolean;
  text: string;
  numberOfLikes : number  
  numberOfReplies : number
}

export interface PostWithStory extends Post {
  storyTitle: string;
  storyId: number;
}

export interface Reply {
  hash: string;
  author: Author;
  text: string;
  timestamp: string;
}

export interface SuggestedStory {
  storyId: number;
  title: string;
  type?: StoryType;
  numberOfPosts?: number;
}

export interface TrendingItem {
  storyId: number;
  title: string;
  authorFid: number;
  numberOfPosts: number;
}


export interface SuggestedStory {
  storyId: number;
  title: string;
  type?: StoryType;
  numberOfPosts?: number;
}


   
export interface SuggestedTag {
  id: string;
  name: string;
  followers: number;
}

export interface SuggestedUser {
  id: string;
  name: string;
  followers: number;
}


export interface HoverStory {
  id : number
  title : string
  timestamp : string
  text : string
  authorFid : number
  authorUserName : string
  tags : Tag[]
  type? : string
  numberOfPosts? : number
}
