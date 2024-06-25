import { User } from "./user";


// Reaction-related types
interface Reaction {
    fid: number;
    fname: string;
  }
  
  interface Reactions {
    likes_count: number;
    recasts_count: number;
    likes: Reaction[];
    recasts: Reaction[];
  }
  
  // Embed and Frame types
  interface Embed {
    url: string;
  }
  
  interface FrameButton {
    index: number;
    title: string;
    action_type: string;
  }
  
  interface Frame {
    version: string;
    title: string;
    image: string;
    image_aspect_ratio: string;
    buttons: FrameButton[];
    input: Record<string, unknown>;
    state: Record<string, unknown>;
    post_url: string;
    frames_url: string;
  }
  
  // Cast-related types
  interface CastParentAuthor {
    fid: number | null;
  }
  
  interface CastReplies {
    count: number;
  }
  
  interface Channel {
    object: string;
    id: string;
    name: string;
    image_url: string;
  }
  
  export interface Cast {
    object: 'cast';
    hash: string;
    thread_hash: string;
    parent_hash: string | null;
    parent_url: string | null;
    root_parent_url: string | null;
    parent_author: CastParentAuthor;
    author: User;
    text: string;
    timestamp: string;
    embeds: Embed[];
    frames: Frame[];
    reactions: Reactions;
    replies: CastReplies;
    channel: Channel | null;
    mentioned_profiles: User[];
    viewer_context: {
      liked: boolean;
      recasted: boolean;
    };
    direct_replies: Cast[];
  }