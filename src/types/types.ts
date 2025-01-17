 

export type Tag = {
    id: string;
    name: string;
    followers: number;
    isFollowed: boolean;
    description: string;
  };
  
  export type Entity = {
    id: string;
    name: string;
    description: string;
    type: string;
  };
  
  // ===========================
  // 2. Define User-Related Types
  // ===========================
  
  export type UserBase = {
    object: "user";
    fid: number;
    custody_address: string;
    username: string;
    display_name: string;
    pfp_url: string;
    follower_count: number;
    following_count: number;
    verifications: string[];
    active_status: "active" | "inactive";
    power_badge: boolean;
    tags: Tag[];
    profile: {
      bio: {
        text: string;
        mentioned_profiles?: UserBase[];
      };
    };
    verified_addresses: {
      eth_addresses: string[];
      sol_addresses: string[];
    };
    viewer_context: {
      following: boolean;
      followed_by: boolean;
    };
  };
  
  export type User = UserBase;
  
  export type UserWithStories = UserBase & {
    stories?: number;
    posts?: number;
  };
  
  // ===========================
  // 3. Define Cast-Related Types 
  // ===========================
  
  export type CastBase = {
    object: "cast";
    hash: string;
    thread_hash: string;
    parent_hash: string | null;
    parent_url: string | null;
    root_parent_url: string | null;
    text: string;
    timestamp: string;
  };
  
  
  export type CastFull = CastBase & {
    parent_author: {
      fid: number | null;
    };
    author: UserBase;
    embeds: { url: string }[];
    frames: {
      version: string;
      title: string;
      image: string;
      image_aspect_ratio: string;
      buttons: {
        index: number;
        title: string;
        action_type: string;
      }[];
      input: Record<string, unknown>;
      state: Record<string, unknown>;
      post_url: string;
      frames_url: string;
    }[];
    reactions: {
      likes_count: number;
      recasts_count: number;
      likes: { fid: number; fname: string }[];
      recasts: { fid: number; fname: string }[];
    };
    replies: { count: number };
    channel: {
      object: string;
      id: string;
      name: string;
      image_url: string;
    } | null;
    mentioned_profiles: UserBase[];
    viewer_context: {
      liked: boolean;
      recasted: boolean;
    };
    direct_replies: CastFull[]; // Recursive type
  };
  
  
  
  export type CastinFeed = CastBase & {
    parent_author: {
      fid: number | null;
    };
    author: UserBase;
    embeds: { url: string }[];
    frames?: {
      version: string;
      title: string;
      image: string;
      image_aspect_ratio: string;
      buttons: {
        index: number;
        title: string;
        action_type: string;
      }[];
      input: Record<string, unknown>;
      state: Record<string, unknown>;
      post_url: string;
      frames_url: string;
    }[];
    reactions: {
      likes_count: number;
      recasts_count: number;
      likes: { fid: number; fname: string }[];
      recasts: { fid: number; fname: string }[];
    };
    replies: { count: number };
    channel: {
      object: string;
      id: string;
      name: string;
      image_url: string;
    } | null;
    mentioned_profiles: UserBase[];
    viewer_context: {
      liked: boolean;
      recasted: boolean;
    };
  };
  
  
  
  export type Cast = CastBase & {
    parent_author: {
      fid: number | null;
    };
    reactions: {
      likes_count: number;
      recasts_count: number;
      likes: { fid: number; fname: string }[];
      recasts: { fid: number; fname: string }[];
    };
    replies: { count: number };
    channel: {
      object: string;
      id: string;
      name: string;
      image_url: string;
    } | null;
    mentioned_profiles: UserBase[];
    viewer_context: {
      liked: boolean;
      recasted: boolean;
    };
  };
  
  // ===========================
  // 4. Define Story & Stories Types
  // ===========================
  
  export type Story = {
    id: string;
    title: string;
    type? : string
    tags: Tag[];
    entities: Entity[];
    isBookmarked: boolean;
    mentionedStories: string[];
    author: UserWithStories; 
    cast: Cast;
    posts?: Post[]
    numberofPosts : number
  };
  
  export type Stories = {
    stories: Story[];
    nextCursor?: string;
  };
  
  
    export interface Post {
      id: string;
      tags: Tag[];
      entities: Entity[];
      isBookmarked: boolean;
      mentionedStories: string[];
      author: UserWithStories; 
      cast: Cast;
      numberofReplies : number
    }
  
    export type Posts = {
      posts: Post[];
      nextCursor?: string;
    };
  
  
    export interface Reply {
      author : UserWithStories
      cast: Cast
    }
  
  
  
    export interface HoverStory {
      id : string
      title : string
      timestamp : string
      text : string
      authorFid : number
      authorUserName : string
      tags : Tag[]
      type? : string
      numberofPosts? : number
    }
  
  
    export interface SuggestedStory {
      id : string 
      title : string 
      text : string
      timestamp : Date
      tags : Tag[]
      type? : string
      numberofPosts? : number
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
    
  
    export interface Category {
      id : string
      name : string
      description? : string 
    }


    