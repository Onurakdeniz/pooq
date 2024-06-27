
import { z } from "zod";
import { Tag,Entity , UserBase , User , Cast , CastBase , Story, Stories, UserWithStories } from "@/types"

// ===========================
// 1. Define Base Types
// ===========================


// ===========================
// 5. Zod Schemas (Defined After Types)
// ===========================

export const TagSchema: z.ZodType<Tag> = z.object({
  id: z.string().uuid(),
  name: z.string(),
  followers: z.number().int().nonnegative(),
  isFollowed: z.boolean(),
  description: z.string(),
});

export const EntitySchema: z.ZodType<Entity> = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.string(),
});

export const UserBaseSchema: z.ZodType<UserBase> = z.lazy(() =>
  z.object({
    object: z.literal("user"),
    fid: z.number(),
    custody_address: z.string(),
    username: z.string(),
    display_name: z.string(),
    pfp_url: z.string(),
    follower_count: z.number(),
    following_count: z.number(),
    verifications: z.array(z.string()),
    active_status: z.enum(["active", "inactive"]),
    power_badge: z.boolean(),
    tags: z.array(TagSchema),
    profile: z.object({
      bio: z.object({
        text: z.string(),
        mentioned_profiles: z.array(UserBaseSchema).optional(),
      }),
    }),
    verified_addresses: z.object({
      eth_addresses: z.array(z.string()),
      sol_addresses: z.array(z.string()),
    }),
    viewer_context: z.object({
      following: z.boolean(),
      followed_by: z.boolean(),
    }),
  })
);

export const UserSchema: z.ZodType<User> = UserBaseSchema;
export const UserWithStoriesSchema: z.ZodType<UserWithStories> = z.lazy(() =>
  UserBaseSchema.and(
    z.object({
      stories: z.number(),
      posts: z.number(),
    })
  )
);

export const CastBaseSchema: z.ZodType<CastBase> = z.object({
  object: z.literal("cast"),
  hash: z.string(),
  thread_hash: z.string(),
  parent_hash: z.string().nullable(),
  parent_url: z.string().nullable(),
  root_parent_url: z.string().nullable(),
  text: z.string(),
  timestamp: z.string(),
});

export const CastSchema: z.ZodType<Cast> = z.lazy(() =>
  z.object({ 
    object: z.literal("cast"),
    hash: z.string(),
    thread_hash: z.string(),
    parent_hash: z.string().nullable(),
    parent_url: z.string().nullable(),
    root_parent_url: z.string().nullable(),
    text: z.string(),
    timestamp: z.string(),
    parent_author: z.object({
      fid: z.number().nullable(),
    }),
    author: UserBaseSchema,
    embeds: z.array(
      z.object({
        url: z.string(),
      }),
    ),
    frames: z.array(
      z.object({
        version: z.string(),
        title: z.string(),
        image: z.string(),
        image_aspect_ratio: z.string(),
        buttons: z.array(
          z.object({
            index: z.number(),
            title: z.string(),
            action_type: z.string(),
          }),
        ),
        input: z.record(z.unknown()),
        state: z.record(z.unknown()),
        post_url: z.string(),
        frames_url: z.string(),
      }),
    ),
    reactions: z.object({
      likes_count: z.number(),
      recasts_count: z.number(),
      likes: z.array(
        z.object({
          fid: z.number(),
          fname: z.string(),
        }),
      ),
      recasts: z.array(
        z.object({
          fid: z.number(),
          fname: z.string(),
        }),
      ),
    }),
    replies: z.object({
      count: z.number(),
    }),
    channel: z
      .object({
        object: z.string(),
        id: z.string(),
        name: z.string(),
        image_url: z.string(),
      })
      .nullable(),
    mentioned_profiles: z.array(UserBaseSchema),
    viewer_context: z.object({
      liked: z.boolean(),
      recasted: z.boolean(),
    }),
    direct_replies: z.array(CastSchema), 
  })
);

export const StorySchema: z.ZodType<Story> = z.object({
  id: z.string(),
  title: z.string(),
  tags: z.array(TagSchema),
  entities: z.array(EntitySchema),
  isBookmarked: z.boolean(),
  mentionedStories: z.array(z.string()),
  author: UserWithStoriesSchema, // Change this from UserSchema to UserWithStoriesSchema
  cast: CastSchema,
});
export const StoriesSchema: z.ZodType<Stories> = z.object({
  stories: z.array(StorySchema),
  nextCursor: z.string().optional(),
});
