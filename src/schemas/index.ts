
import { z } from "zod";
import { Tag,Entity , UserBase , User , Post, Posts,Cast ,CastFull, CastinFeed, CastBase , Story, Stories, UserWithStories ,HoverStory , SuggestedStory ,SuggestedTag ,SuggestedUser } from "@/types"

 

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

export const CastFullSchema: z.ZodType<CastFull> = z.lazy(() =>
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
    direct_replies: z.array(CastFullSchema), 
  })
);

 

export const CastinFeedSchema: z.ZodType<CastinFeed> = z.lazy(() =>
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
    ).optional(),
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
 
  })
);

 


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
  })
);


export const PostSchema : z.ZodType<Post> = z.object({
  id: z.string(),
  tags: z.array(TagSchema),
  entities: z.array(EntitySchema),
  isBookmarked: z.boolean(),
  mentionedStories: z.array(z.string()),
  author: UserWithStoriesSchema,  
  cast: CastSchema,
  numberofReplies: z.number()
});

export const PostsSchema: z.ZodType<Posts> = z.object({
  posts: z.array(PostSchema),
  nextCursor: z.string().optional(),
});



export const StorySchema: z.ZodType<Story> = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string().optional(),
  tags: z.array(TagSchema),
  entities: z.array(EntitySchema),
  isBookmarked: z.boolean(),
  mentionedStories: z.array(z.string()),
  author: UserWithStoriesSchema,  
  cast: CastSchema,
  numberofPosts: z.number(),
  posts : z.array(PostSchema).optional()
});
export const StoriesSchema: z.ZodType<Stories> = z.object({
  stories: z.array(StorySchema),
  nextCursor: z.string().optional(),
});


export const hoverStorySchema : z.ZodType <HoverStory> = z.object({
  id: z.string(),
  title: z.string(),
  timestamp: z.date(), 
  text: z.string(),
  authorFid: z.number(),
  authorUserName: z.string(),
  tags: z.array(TagSchema),
  type: z.string().optional(), 
  numberofPosts: z.number().optional(), 
});


export const SuggestedStorySchema : z.ZodType <SuggestedStory> = z.object(
  {
    id: z.string(),
    title : z.string(),
    text: z.string(),
    timestamp : z.date(),
    tags: z.array(TagSchema),
    type: z.string().optional(), 
    numberofPosts: z.number().optional(), 
  }
)

export const SuggestedTagSchema : z.ZodType <SuggestedTag> = z.object(
  {
  id: z.string(),
  name: z.string(),
  followers: z.number()
});


export const SuggestedUserSchema : z.ZodType <SuggestedUser> = z.object(
  {
  id: z.string(),
  name: z.string(),
  followers: z.number()
});