// storyTypes.ts
import { z } from 'zod';

// Input type remains the same
export const GetStoryWithPostsInput = z.object({
  storyId: z.number(),
  cursor: z.number().optional(),
  limit: z.number().default(10),
});

export const GetStoryWithPostsByUser = z.object({
  userFid: z.number(),
  cursor: z.string().optional(),
  limit: z.number().default(10),
});



export type GetStoryWithPostsInputType = z.infer<typeof GetStoryWithPostsInput>;

// Updated Output types
export const TagSchema = z.object({
    id: z.string(),
    name: z.string(),
    followers: z.number().optional(),
    isFollowed: z.boolean().optional(),  
    description: z.string().optional(),  
  });

  export  const EntitySchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),  
    type: z.string().optional(),  
  });

const BioSchema = z.object({
  text: z.string(),
});

const ProfileSchema = z.object({
  bio: BioSchema,
});

const VerifiedAddressesSchema = z.object({
  eth_addresses: z.array(z.string()),
  sol_addresses: z.array(z.string()),
});

export const AuthorViewerContextSchema = z.object({
  following: z.boolean(),
  followed_by: z.boolean(),
});

const CastViewerContextSchema = z.object({
  liked: z.boolean(),
  recasted: z.boolean(),
});

const ParentAuthorSchema = z.object({
  fid: z.number().nullable(),
});

const ReactionUserSchema = z.object({
  fid: z.number(),
  fname: z.string(),
});

export const ReactionsSchema = z.object({
  likes_count: z.number(),
  recasts_count: z.number(),
  likes: z.array(ReactionUserSchema),
  recasts: z.array(ReactionUserSchema),
});


// Updated Output types
export const ParentTagSchema = z.object({
  id: z.string(),
  name: z.string(),
  followers: z.number().optional(),
  isFollowed: z.boolean().optional(),  
  description: z.string().optional(),  
});
export const AuthorSchema = z.object({
  numberOfStories: z.number(),
  numberOfPosts: z.number(),
  object: z.literal('user'),
  username: z.string(),
  fid: z.number(),
  parentTags: z.array(ParentTagSchema).optional(),
  custody_address: z.string(),
  display_name: z.string(),
  pfp_url: z.string(),
  profile: ProfileSchema,
  follower_count: z.number(),
  following_count: z.number(),
  verifications: z.array(z.string()),
  verified_addresses: VerifiedAddressesSchema,
  active_status: z.string(),
  power_badge: z.boolean(),
  viewer_context: AuthorViewerContextSchema,
});

export const CastSchema = z.object({
  parent_author: ParentAuthorSchema,
  hash: z.string(),
  thread_hash: z.string(),
  parent_hash: z.string().nullable(),
  text: z.string(),
  timestamp: z.string(),
  reactions: ReactionsSchema,
  mentioned_profiles: z.array(z.object({
    fid: z.number(),
    username: z.string(),
  }).or(z.string())).optional(),
  viewer_context: CastViewerContextSchema,
  replies: z.object({
    count: z.number(),
  }),
});

export const TagStorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const EntityStorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const CategoryStorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

const MentionedProfileSchema = z.object({
  fid: z.number(),
  username: z.string(),
});


export const StorySchema = z.object({
  id: z.string(),
  hash: z.string().optional(),
  title: z.string(),
  type: z.enum(['FEED', 'STORY']),
  tags: z.array(TagStorySchema),
  entities: z.array(EntityStorySchema),
  categories: z.array(CategoryStorySchema),
  isBookmarked: z.boolean(),
  mentioned_profiles: z.array(z.union([z.string(), MentionedProfileSchema])).optional(),
  mentionedStories: z.array(z.string()), // Add this line
  numberofPosts: z.number(),
  author: AuthorSchema,
  cast: CastSchema,
});

export const PostSchema = z.object({
  id: z.string(),
  hash: z.string(),
  tags: z.array(TagSchema),
  entities: z.array(EntitySchema),
  isBookmarked: z.boolean(),
  author: AuthorSchema,
  cast: CastSchema,
  isLikedByUser: z.boolean(),
  text: z.string(),
 
});

export const GetStoryWithPostsOutput = z.object({
    story: StorySchema,
    posts: z.array(PostSchema),
    nextCursor: z.number().nullable(),
  });

export type GetStoryWithPostsOutputType = z.infer<typeof GetStoryWithPostsOutput>;

// Additional schema for TrendingItem
export const TrendingItemSchema = z.object({
  storyId: z.number(),
  title: z.string(),
  authorFid: z.number(),
  numberOfPosts: z.number(),
});

export type TrendingItemType = z.infer<typeof TrendingItemSchema>;