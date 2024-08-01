import type { Story, Tag, Post, Author, PostWithStory } from "@/types";
import { Prisma, PrismaClient ,StoryType} from "@prisma/client";
import { fetchCastsFromNeynar } from "./fetch-casts";
import { TRPCError } from "@trpc/server";

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
  viewer_context: {
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
  id: number;
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
      following: neynarAuthor.viewer_context.following,
      followed_by: neynarAuthor.viewer_context.followed_by  
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


export async function constructWhereClause(db: PrismaClient, cursor?: number, categoryFilters?: string[], llmMode?: boolean, tagName?: string): Promise<Prisma.StoryWhereInput> {
  const whereClause: Prisma.StoryWhereInput = { isProcessed: true };

  if (cursor) {
    whereClause.id = { lt: cursor };
  }

  const extractionFilter: Prisma.ExtractionWhereInput = {};

  if (categoryFilters && categoryFilters.length > 0) {
    extractionFilter.categories = {
      some: { category: { name: { in: categoryFilters } } },
    };
  }

  if (llmMode) {
    const allLlmFeeds = await db.lLMFeed.findMany({ include: { tags: true } });
    const allLlmTags = Array.from(new Set(allLlmFeeds.flatMap(feed => feed.tags.map(tag => tag.id))));
    
    if (allLlmTags.length > 0) {
      extractionFilter.tags = {
        some: { tag: { id: { in: allLlmTags } } },
      };
    }
  }

  if (tagName) {
    extractionFilter.tags = {
      some: { tag: { name: tagName } },
    };
  }

  if (Object.keys(extractionFilter).length > 0) {
    whereClause.extraction = extractionFilter;
  }

  return whereClause;
}



export async function fetchAndFormatStories(db: PrismaClient, whereClause: Prisma.StoryWhereInput, limit: number, userId?: string, userFid?: number, cursor?: number) {
  const stories = await db.story.findMany({
    where: whereClause,
    orderBy: { id: 'desc' },
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    include: {
      extraction: {
        include: {
          tags: { include: { tag: true } },
          entities: { include: { entity: true } },
          categories: { include: { category: true } },
        },
      },
      bookmarks: userId ? { where: { userId } } : false,
      author: true,
      posts: {
        take: 2,
        orderBy: { createdAt: 'desc' },
        include: {
          extraction: {
            include: {
              tags: { include: { tag: true } },
              entities: { include: { entity: true } },
            },
          },
          bookmarks: userId ? { where: { userId } } : false,
        },
      },
    },
  });

  const hasNextPage = stories.length > limit;
  const items = hasNextPage ? stories.slice(0, -1) : stories;

  const hashes = items.flatMap(story => [story.hash, ...story.posts.map(post => post.hash)]);
  const neynarData = await fetchCastsFromNeynar(hashes, userFid);

  const formattedStories = await Promise.all(items.map(async story => {
    const storyNeynarData = neynarData.find(data => data.hash === story.hash);
    if (!storyNeynarData) return null;

    const formattedStory = await formatStory(story, storyNeynarData, userFid, userId);
    const formattedPosts = await Promise.all(story.posts.map(async post => {
      const postNeynarData = neynarData.find(data => data.hash === post.hash);
      if (!postNeynarData) return null;
      return await formatPost(post, postNeynarData, userId);
    }));

    return {
      ...formattedStory,
      posts: formattedPosts.filter((post): post is Post => post !== null),
    };
  }));

  const validFormattedStories = formattedStories.filter((story): story is Story & { posts: Post[] } => story !== null);

  return {
    items: validFormattedStories,
    nextCursor: hasNextPage ? items[items.length - 1]?.id : null,
  };
}



export async function fetchAndFormatPosts(db: PrismaClient, storyId: number, cursor: string | undefined, limit: number, userId?: string, userFid?: number, dbStory?: DBStory) {
  const posts = await db.post.findMany({
    where: { storyId },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    include: {
      extraction: {
        include: {
          tags: { include: { tag: true } },
          entities: { include: { entity: true } },
        },
      },
      bookmarks: userId ? { where: { userId } } : false,
    },
  });

  const hasNextPage = posts.length > limit;
  const items = hasNextPage ? posts.slice(0, -1) : posts;

  if (!dbStory) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Story data is missing",
    });
  }

  const hashes = [dbStory.hash, ...items.map(post => post.hash)];
  const neynarData = await fetchCastsFromNeynar(hashes, userFid);

  const storyNeynarData = neynarData.find(data => data.hash === dbStory.hash);
  if (!storyNeynarData) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No Neynar data found for the main story",
    });
  }

  const formattedStory = await formatStory(dbStory, storyNeynarData, userFid, userId);

  const formattedPosts = await Promise.all(items.map(async post => {
    const postNeynarData = neynarData.find(data => data.hash === post.hash);
    if (!postNeynarData) return null;
    return await formatPost(post, postNeynarData, userId);
  }));

  const validFormattedPosts = formattedPosts.filter((post): post is Post => post !== null);
  const nextCursor = hasNextPage ? posts[posts.length - 1]?.id : null;

  return {
    story: formattedStory,
    posts: validFormattedPosts,
    nextCursor,
  };
}


export async function fetchAndFormatPostsWithStory(db: PrismaClient, whereClause: Prisma.PostWhereInput, limit: number, userId?: string, userFid?: number, cursor?: string): Promise<{ items: PostWithStory[], nextCursor: string | null }> {
  const posts = await db.post.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    include: {
      story: {
        include: {
          extraction: {
            include: {
              tags: { include: { tag: true } },
              entities: { include: { entity: true } },
              categories: { include: { category: true } },
            },
          },
        },
      },
      extraction: {
        include: {
          tags: { include: { tag: true } },
          entities: { include: { entity: true } },
        },
      },
      bookmarks: userId ? { where: { userId } } : false,
    },
  });

  const hasNextPage = posts.length > limit;
  const items = hasNextPage ? posts.slice(0, -1) : posts;

  const hashes = items.map(post => post.hash);
  const neynarData = await fetchCastsFromNeynar(hashes, userFid);

  const formattedPosts = await Promise.all(items.map(async post => {
    const postNeynarData = neynarData.find(data => data.hash === post.hash);
    if (!postNeynarData) return null;
    const formattedPost = await formatPost(post, postNeynarData, userId);
    return {
      ...formattedPost,
      storyTitle: post.story?.extraction?.title ?? "",
      storyId: post.storyId,
    };
  }));

  const validFormattedPosts = formattedPosts.filter((post): post is PostWithStory => post !== null);

  return {
    items: validFormattedPosts,
    nextCursor: hasNextPage ? items[items.length - 1]?.id ?? null : null,
  };
}

 