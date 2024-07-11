import type { Story, Tag, Post, Author } from "@/types";
import { PrismaClient ,StoryType} from "@prisma/client";

const prisma = new PrismaClient();

interface NeynarAuthor {
  username: string;
  fid: number;
  display_name: string;
  pfp_url: string;
  custody_address: string;
  follower_count: number;
  following_count: number;
  verifications: string[];
  active_status: string;
  power_badge: boolean;
  viewer_context?: {
    following: boolean;
    followed_by: boolean;
  };
  profile: {
    bio: {
      text: string;
    };
  };
}

interface Cast {
  author: NeynarAuthor;
  replies: {
    count: number;
  };
  viewer_context: {
    liked: boolean;
  };
  reactions: {
    likes_count: number;
    recasts_count: number;
    likes: Array<{ fid: number; fname: string }>;
    recasts: Array<{ fid: number; fname: string }>;
  };
  timestamp: string;
}

interface DBStory {
  id: string;
  hash: string;
  text: string;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  isProcessed: boolean;
  extraction?: {
    id: number;
    title: string;
    description?: string | null;
    view?: string | null;
    type?: StoryType | null;
    tags: Array<{ 
      tag: { 
        id: string; 
        name: string; 
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
      };
      tagId: string;
      extractionId: number;
    }>;
    entities: Array<{ 
      entity: { 
        id: string; 
        name: string; 
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
      };
      entityId: string;
      extractionId: number;
    }>;
    categories: Array<{ 
      category: { 
        id: string; 
        name: string; 
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
      };
      categoryId: string;
      extractionId: number;
    }>;
  } | null;
  bookmarks: Array<{ id: string; userId: string }>;
  author: {
    fid: number;
    userName: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

interface DBPost {
  id: string;
  hash: string;
  text: string;
  extraction: {
    tags: Array<{
      tag: {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
      };
      tagId: string;
      extractionId: number;
    }>;
    entities: Array<{
      entity: {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
      };
      entityId: string;
      extractionId: number;
    }>;
  } | null;
  authorId: number;
  bookmarks: Array<{ userId: string }>;
}
 
export async function formatAuthor(
  neynarAuthor: NeynarAuthor,
  dbAuthorId: number
): Promise<Author> {
  return {
    username: neynarAuthor.username,
    isUser: true,
    fid: neynarAuthor.fid,
    displayName: neynarAuthor.display_name,
    pfpUrl: neynarAuthor.pfp_url,
    custodyAddress: neynarAuthor.custody_address,
    followerCount: neynarAuthor.follower_count,
    followingCount: neynarAuthor.following_count,
    verifications: neynarAuthor.verifications,
    activeStatus: neynarAuthor.active_status,
    powerBadge: neynarAuthor.power_badge,
    viewerContent: {
      following: neynarAuthor.viewer_context?.following ?? false,
      followedBy: neynarAuthor.viewer_context?.followed_by ?? false,
    },
    numberOfStories: await prisma.story.count({
      where: { authorId: dbAuthorId },
    }),
    numberOfPosts: await prisma.post.count({
      where: { authorId: dbAuthorId },
    }),
    isRegistered:
      (await prisma.user.findUnique({ where: { fid: dbAuthorId } })) !== null,
    bio: neynarAuthor.profile.bio.text,
  };
}
export async function formatStory(
  dbStory: DBStory,
  cast: Cast,
  viewerFid?: number,
  userId?: string
): Promise<Story> {
  const isBookmarked: boolean = dbStory.bookmarks.some(bookmark => bookmark.userId === userId);

  const author = await formatAuthor(cast.author, dbStory.author.fid);

  return {
    id: dbStory.id,
    hash: dbStory.hash,
    text: dbStory.text,
    title: dbStory.extraction?.title,
    view: dbStory.extraction?.view,
    type: dbStory.extraction?.type ,
    description: dbStory.extraction?.description,
    timestamp: dbStory.createdAt.toISOString(),
    isBookmarkedByUserId: isBookmarked,
    isLikedBuUserFid: cast.viewer_context.liked,
    numberOfLikes: cast.reactions.likes_count,
    numberOfPosts: cast.replies.count,
   
    author,
    tags: dbStory.extraction?.tags.map((tagRelation) => ({
      id: tagRelation.tag.id,
      name: tagRelation.tag.name,
      description: tagRelation.tag.description ?? undefined,
    })) ?? [],
    entities: dbStory.extraction?.entities.map((entityRelation) => ({
      id: entityRelation.entity.id,
      name: entityRelation.entity.name,
      description: entityRelation.entity.description ?? undefined,
    })) ?? [],
    categories: dbStory.extraction?.categories.map((categoryRelation) => ({
      id: categoryRelation.category.id,
      name: categoryRelation.category.name,
      description: categoryRelation.category.description ?? undefined,
    })) ?? [],
  };
}

export async function formatPost(
  dbPost: DBPost,
  neynarData: Cast,
  userId?: string
): Promise<Post> {
  const isBookmarked: boolean = userId
    ? dbPost.bookmarks?.some(bookmark => bookmark.userId === userId) ?? false
    : false;

  const author = await formatAuthor(neynarData.author, dbPost.authorId);

  return {
    id: dbPost.id,
    hash: dbPost.hash,
    tags: dbPost.extraction?.tags?.map((t) => ({
      id: t.tag.id,
      name: t.tag.name,
      description: t.tag.description ?? "",
    })) ?? [],
    entities: dbPost.extraction?.entities?.map((e) => ({
      id: e.entity.id,
      name: e.entity.name,
      description: e.entity.description ?? "",
    })) ??[],
    isBookmarkedByUserId: isBookmarked,
    author,
    timestamp: neynarData.timestamp,
    isLikedBuUserFid: neynarData.viewer_context.liked,
    text: dbPost.text,
    numberOfLikes: neynarData.reactions.likes_count,
    numberOfReplies: neynarData.replies.count,
  };
}