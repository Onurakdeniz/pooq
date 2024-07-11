// storyTypes.ts
import { z } from "zod";
import { StoryType } from "@prisma/client";

const storyTypeEnum = z.nativeEnum(StoryType);

const BaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

export const EntitySchema = BaseSchema;
export const CategorySchema = BaseSchema;

export const TagSchema = BaseSchema;

export const ReferenceStorySchema = z.object({
  id: z.string(),
  referenceText: z.string(),
  storyTitle: z.string(),
});

export const ReferenceUserSchema = z.object({
  id: z.string(),
  referenceText: z.string(),
  fid: z.number(),
});

export const ReactionUserSchema = z.object({
  fid: z.number(),
  fname: z.string(),
});

export const ReactionsSchema = z.object({
  likes_count: z.number(),
  recasts_count: z.number(),
  likes: z.array(ReactionUserSchema),
  recasts: z.array(ReactionUserSchema),
});

export const VerifiedAddressesSchema = z.object({
  eth_addresses: z.array(z.string()),
  sol_addresses: z.array(z.string()),
});

export const AuthorViewerContextSchema = z.object({
  following: z.boolean(),
  followedBy: z.boolean(),
});

export const AuthorSchema = z.object({
  username: z.string(),
  isUser: z.boolean(),
  fid: z.number(),
  displayName: z.string(),
  pfpUrl: z.string(),
  custodyAddress: z.string(),
  followerCount: z.number(),
  followingCount: z.number(),
  verifications: z.array(z.string()),
  activeStatus: z.string(),
  powerBadge: z.boolean(),
  viewerContent: AuthorViewerContextSchema,
  numberOfStories: z.number(),
  numberOfPosts: z.number(),
  isRegistered: z.boolean(),
  bio: z.string(),
});

const BaseContentSchema = z.object({
  id: z.string(),
  hash: z.string(),
  text: z.string(),
  timestamp: z.string(),
  isBookmarkedByUserId: z.boolean(),
  isLikedBuUserFid: z.boolean(),
  author: AuthorSchema,
  tags: z.array(TagSchema),
  entities: z.array(EntitySchema),
});

export const StorySchema = BaseContentSchema.extend({
  title: z.string().optional(),
  view: z.string().nullable().optional(),
  type: storyTypeEnum.nullable().optional(),
  description: z.string().nullable().optional(),
  categories: z.array(CategorySchema),
  numberOfPosts: z.number().optional(),
  numberOfLikes: z.number(),
});

export const PostSchema = BaseContentSchema.extend({
  numberOfLikes: z.number(),
  numberOfReplies: z.number(),
});

export const PostWithStorySchema = PostSchema.extend({
  storyTitle: z.string(),
  storyId: z.string(),
});

export const ReplySchema = z.object({
  hash: z.string(),
  author: AuthorSchema,
  text: z.string(),
  timestamp: z.string(),
});

export const SuggestedStorySchema = z.object({
  storyId: z.string(),
  title: z.string(),
  type: storyTypeEnum.optional(),
  numberOfPosts: z.number().optional(),
});

export const TrendingItemSchema = z.object({
  storyId: z.string(),
  title: z.string(),
  authorFid: z.number(),
  numberOfPosts: z.number(),
});
export const getStoryWithPostsOutputSchema = z.object({
  story: StorySchema,
  posts: z.array(PostSchema),
  nextCursor: z.string().nullable(),
});
