import type { NeynarResponse } from "@/lib/lib";
import type { Author, Cast, CastViewerContext, ReactionUser, Reactions, Story, Tag, Entity, CategoryStory } from "@/types/type";

 
  
 

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
    timestamp: castData?.timestamp ?? "",
    reactions: {
      likes_count: castData?.reactions.likes_count ?? castData?.reactions.likes.length ?? 0,
      recasts_count: castData?.reactions.recasts_count ?? castData?.reactions.recasts.length ?? 0,
      likes: castData?.reactions.likes ?? [],
      recasts: castData?.reactions.recasts ?? [],
    },
    mentioned_profiles: castData?.mentioned_profiles ?? [],
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