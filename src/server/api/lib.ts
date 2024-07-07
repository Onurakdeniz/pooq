import type { NeynarResponse } from "@/lib/lib";
import type { Author, Cast, CastViewerContext, ReactionUser, Reactions, Story, Tag, Entity, CategoryStory } from "@/types/type";

type FormattedPost = {
  id: number;
  hash: string;
  authorId: number;
  text: string;
  storyId: number;
  isProcessed: boolean;
  createdAt: Date;
  updatedAt: Date;
  extraction: {
    title?: string;
    tags?: {
      tag: {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
      };
      tagId: string;
      extractionId: number;
    }[];
    entities?: {
      entity: {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
      };
      entityId: string;
      extractionId: number;
    }[];
    categories?: {
      category: {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
      };
      categoryId: string;
      extractionId: number;
    }[];
  } | null;
  bookmarks: {
    id: string;
    userId: string;
    storyId: number | null;
    postId: number | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
  story: {
    id: number;
    authorId: number;
    extraction: {
      title: string;
    } | null;
  };
  author: Author;
  cast: Cast;
  postsCount: number;
};
 

  export const formatReactions = (reactions: Partial<Reactions> | undefined): Reactions => ({
    likes_count: reactions?.likes?.length ?? 0,
    recasts_count: reactions?.recasts?.length ?? 0,
    likes: reactions?.likes ?? [],
    recasts: reactions?.recasts ?? [],
  });
  
  export const formatAuthor = (
    authorData: Omit<Author, 'numberOfStories' | 'numberOfPosts'> | undefined,
    storyCount = 0
  ): Author => ({
    numberOfStories: storyCount,
    numberOfPosts: 0,
    object: "user",
    username: authorData?.username ?? "",
    fid: authorData?.fid ?? 0,
    custody_address: authorData?.custody_address ?? "",
    display_name: authorData?.display_name ?? "",
    pfp_url: authorData?.pfp_url ?? "",
    profile: authorData?.profile ?? { bio: { text: "" } },
    follower_count: authorData?.follower_count ?? 0,
    following_count: authorData?.following_count ?? 0,
    verifications: authorData?.verifications ?? [],
    verified_addresses: authorData?.verified_addresses ?? { eth_addresses: [], sol_addresses: [] },
    active_status: authorData?.active_status ?? "",
    power_badge: authorData?.power_badge ?? false,
    viewer_context: authorData?.viewer_context ?? { following: false, followed_by: false },
    
  });
  
  export const formatCast = (
    castData: (Omit<Cast, "reactions"> & {
      reactions: { 
        likes: ReactionUser[]; 
        recasts: ReactionUser[];
        likes_count?: number;
        recasts_count?: number;
      };
      viewer_context: CastViewerContext;
    }) | undefined
  ): Cast => ({
    parent_author: castData?.parent_author ?? { fid: null },
    hash: castData?.hash ?? "",
    thread_hash: castData?.thread_hash ?? "",
    parent_hash: castData?.parent_hash ?? null,
    text: castData?.text ?? "",
    replies: castData?.replies ?? { count: 0 },  // Provide a default value
    timestamp: castData?.timestamp ?? "",
    reactions: {
      likes_count: castData?.reactions.likes_count ?? castData?.reactions.likes.length ?? 0,
      recasts_count: castData?.reactions.recasts_count ?? castData?.reactions.recasts.length ?? 0,
      likes: castData?.reactions.likes ?? [],
      recasts: castData?.reactions.recasts ?? [],
    },
    mentioned_profiles: (castData?.mentioned_profiles as Author[]) ?? [],
    viewer_context: castData?.viewer_context ?? { liked: false, recasted: false },
  });


  
  export const formatStory = (
    story: {
      id: number;
      extraction: {
        title?: string;
        tags?: { tag: { id: string; name: string; description: string | null; createdAt: Date; updatedAt: Date; }; tagId: string; extractionId: number; }[];
        entities?: { entity: { id: string; name: string; description: string | null; createdAt: Date; updatedAt: Date; }; entityId: string; extractionId: number; }[];
        categories?: { category: { id: string; name: string; description: string | null; createdAt: Date; updatedAt: Date; }; categoryId: string; extractionId: number; }[];
        mentionedStories?: string[];
      } | null;
      bookmarks: {
        id: string;
        userId: string;
        storyId: number | null;
        postId: number | null;
        createdAt: Date;
        updatedAt: Date;
      }[];
      authorId: number;
      createdAt: Date;
      updatedAt: Date;
    },
    neynarData: NeynarResponse | undefined,
    storyCount: number,
    postsCount: number,
    userId?: string
  ): Story => ({
    id: story.id.toString(),
    title: story.extraction?.title ?? '',
    type: "STORY",
    tags: story.extraction?.tags?.map((t): Tag => ({ 
      id: t.tag.id, 
      name: t.tag.name, 
      isFollowed: false, 
      followers: 0, 
      description: t.tag.description ?? '' 
    })) ?? [],
    entities: story.extraction?.entities?.map((e): Entity => ({ 
      id: e.entity.id, 
      name: e.entity.name, 
      description: e.entity.description ?? '', 
      type: '' 
    })) ?? [],
    categories: story.extraction?.categories?.map((c): CategoryStory => ({ 
      id: c.category.id, 
      name: c.category.name 
    })) ?? [],
    isBookmarked: userId ? story.bookmarks.some(b => b.userId === userId && b.storyId === story.id) : false,
    mentionedStories: story.extraction?.mentionedStories ?? [],
    numberofPosts: postsCount,
    author: formatAuthor(neynarData?.author, storyCount),
    cast: formatCast(neynarData?.cast),
  });


  export const formatPost = (
      post: {
        id: number;
        hash: string;
        authorId: number;
        text: string;
        storyId: number;
        isProcessed: boolean;
        createdAt: Date;
        updatedAt: Date;
        extraction: {
          title?: string;
          tags?: { tag: { id: string; name: string; description: string | null; createdAt: Date; updatedAt: Date; }; tagId: string; extractionId: number; }[];
          entities?: { entity: { id: string; name: string; description: string | null; createdAt: Date; updatedAt: Date; }; entityId: string; extractionId: number; }[];
          categories?: { category: { id: string; name: string; description: string | null; createdAt: Date; updatedAt: Date; }; categoryId: string; extractionId: number; }[];
        } | null;
        bookmarks: {
          id: string;
          userId: string;
          storyId: number | null;
          postId: number | null;
          createdAt: Date;
          updatedAt: Date;
        }[];
        story: {
          id: number;
          authorId: number;
          extraction: {
            title: string;
          } | null;
        };
      },
      neynarData: NeynarResponse | undefined,
      postsCount: number,
      storyCount: number,
      viewerPrivyId?: string
    ): FormattedPost => ({
      id: post.id,
      hash: post.hash,
      authorId: post.authorId,
      text: post.text,
      storyId: post.storyId,
      isProcessed: post.isProcessed,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      extraction: post.extraction ? {
        title: post.extraction.title,
        tags: post.extraction.tags ?? [],
        entities: post.extraction.entities ?? [],
        categories: post.extraction.categories ?? []
      } : null,
      bookmarks: post.bookmarks,
      story: {
        id: post.story.id,
        authorId: post.story.authorId,
        extraction: {
          title: post.story.extraction?.title ?? ''
        }
      },
      author: formatAuthor(neynarData?.author, storyCount),
      cast: formatCast(neynarData?.cast),
      postsCount: postsCount,
    })