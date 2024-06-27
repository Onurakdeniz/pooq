import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { faker } from "@faker-js/faker";

// ===========================
// 1. Define Base Types
// ===========================

export type Tag = {
  id: string;
  name: string;
  followers: number;
  isFollowed: boolean;
  description: string;
};

type Entity = {
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

type User = UserBase;
export type UserWithStories = UserBase & {
  stories?: number;
  posts?: number;
};

// ===========================
// 3. Define Cast-Related Types 
// ===========================

type CastBase = {
  object: "cast";
  hash: string;
  thread_hash: string;
  parent_hash: string | null;
  parent_url: string | null;
  root_parent_url: string | null;
  text: string;
  timestamp: string;
};

type Cast = CastBase & {
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
  direct_replies: Cast[]; // Recursive type
};

// ===========================
// 4. Define Story & Stories Types
// ===========================

export type Story = {
  id: string;
  title: string;
  tags: Tag[];
  entities: Entity[];
  isBookmarked: boolean;
  mentionedStories: string[];
  author: UserWithStories; 
  cast: Cast;
};

type Stories = {
  stories: Story[];
  nextCursor?: string;
};

// ===========================
// 5. Zod Schemas (Defined After Types)
// ===========================

const TagSchema: z.ZodType<Tag> = z.object({
  id: z.string().uuid(),
  name: z.string(),
  followers: z.number().int().nonnegative(),
  isFollowed: z.boolean(),
  description: z.string(),
});

const EntitySchema: z.ZodType<Entity> = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.string(),
});

const UserBaseSchema: z.ZodType<UserBase> = z.lazy(() =>
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

const UserSchema: z.ZodType<User> = UserBaseSchema;
const UserWithStoriesSchema: z.ZodType<UserWithStories> = z.lazy(() =>
  UserBaseSchema.and(
    z.object({
      stories: z.number(),
      posts: z.number(),
    })
  )
);

const CastBaseSchema: z.ZodType<CastBase> = z.object({
  object: z.literal("cast"),
  hash: z.string(),
  thread_hash: z.string(),
  parent_hash: z.string().nullable(),
  parent_url: z.string().nullable(),
  root_parent_url: z.string().nullable(),
  text: z.string(),
  timestamp: z.string(),
});

const CastSchema: z.ZodType<Cast> = z.lazy(() =>
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

const StorySchema: z.ZodType<Story> = z.object({
  id: z.string(),
  title: z.string(),
  tags: z.array(TagSchema),
  entities: z.array(EntitySchema),
  isBookmarked: z.boolean(),
  mentionedStories: z.array(z.string()),
  author: UserWithStoriesSchema, // Change this from UserSchema to UserWithStoriesSchema
  cast: CastSchema,
});
const StoriesSchema: z.ZodType<Stories> = z.object({
  stories: z.array(StorySchema),
  nextCursor: z.string().optional(),
});












// Helper functions to generate fake data
const generateFakeUser = (): UserWithStories => ({
  object: "user",
  fid: faker.number.int(),
  custody_address: faker.finance.ethereumAddress(),
  username: faker.internet.userName().toLowerCase(),
  display_name: faker.person.fullName(),
  pfp_url: faker.image.avatar(),
  profile: {
    bio: {
      text: faker.lorem.sentence(),
      mentioned_profiles: [] as User[],
    },
  },
  follower_count: faker.number.int({ min: 0, max: 10000 }),
  following_count: faker.number.int({ min: 0, max: 1000 }),
  verifications: [faker.helpers.arrayElement(["email", "phone", "twitter"])],
  verified_addresses: {
    eth_addresses: [faker.finance.ethereumAddress()],
    sol_addresses: [faker.finance.ethereumAddress()], // Using Ethereum address as a placeholder
  },
  active_status: faker.helpers.arrayElement(["active", "inactive"]),
  power_badge: faker.datatype.boolean(),
  viewer_context: {
    following: faker.datatype.boolean(),
    followed_by: faker.datatype.boolean(),
  },
  tags: [],
  stories: faker.number.int({ min: 0, max: 20 }), // Add stories
  posts: faker.number.int({ min: 0, max: 50 }),   // Add posts 
});

const generateFakeCast = (author: UserWithStories): Cast => ({
  object: "cast",
  hash: faker.string.uuid(),
  thread_hash: faker.string.uuid(),
  parent_hash: faker.helpers.arrayElement([null, faker.string.uuid()]),
  parent_url: faker.helpers.arrayElement([null, faker.internet.url()]),
  root_parent_url: faker.helpers.arrayElement([null, faker.internet.url()]),
  parent_author: {
    fid: faker.helpers.arrayElement([null, faker.number.int()]),
  },
  author,
  text: faker.lorem.paragraphs({min:0 , max:5}),
  timestamp: faker.date.recent().toISOString(),
  embeds: [],
  frames: [],
  reactions: {
    likes_count: faker.number.int({ min: 0, max: 1000 }),
    recasts_count: faker.number.int({ min: 0, max: 500 }),
    likes: [],
    recasts: [],
  },
  replies: { count: faker.number.int({ min: 0, max: 100 }) },
  channel: null,
  mentioned_profiles: [],
  viewer_context: {
    liked: faker.datatype.boolean(),
    recasted: faker.datatype.boolean(),
  },
  direct_replies: [],

});

const generateFakeStory = (): Story => {
  const author = generateFakeUser();
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      id: faker.string.uuid(),
      name: faker.word.noun(),
      followers: faker.number.int({ min: 0, max: 10000 }),
      isFollowed: faker.datatype.boolean(),
      description: faker.lorem.sentence(),
    })),
    entities: Array.from(
      { length: faker.number.int({ min: 1, max: 3 }) },
      () => ({
        id: faker.string.uuid(),
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        type: faker.lorem.word(), // <-- Now correctly includes 'type'
      }),
    ),
    isBookmarked: faker.datatype.boolean(),
    mentionedStories: Array.from(
      { length: faker.number.int({ min: 0, max: 3 }) },
      () => faker.string.uuid(),
    ),
    author,
    cast: generateFakeCast(author),
  };
};

export const storyRouter = createTRPCRouter({
  getStories: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional(),
        cursor: z.string().optional(),
      }),
    )
    .output(
      z.object({
        items: z.array(StorySchema),
        nextCursor: z.string().nullable(),
      }),
    )
    .query(async ({ input }) => {
      const { limit = 10, cursor } = input;

      // Generate more stories than necessary to simulate a larger dataset
      const allStories: Story[] = Array.from(
        { length: limit * 2 },
        generateFakeStory,
      );

      // Simulate cursor-based pagination
      const startIndex = cursor
        ? allStories.findIndex((story) => story.id === cursor) + 1
        : 0;
      const paginatedStories = allStories.slice(startIndex, startIndex + limit);

      const nextCursor =
      paginatedStories[paginatedStories.length - 1]?.id ?? null;

      return {
        items: z.array(StorySchema).parse(paginatedStories),
        nextCursor,
      };
    }),

  getStoriesByTags: publicProcedure
    .input(
      z.object({
        tags: z.array(z.string()),
        limit: z.number().min(1).max(100).optional(),
        cursor: z.string().optional(),
      }),
    )
    .output(
      z.object({
        items: z.array(StorySchema),
        nextCursor: z.string().nullable(),
      }),
    )
    .query(async ({ input }) => {
      const { tags, limit = 10, cursor } = input;

      // Generate more stories than necessary to simulate a larger dataset
      const allStories: Story[] = Array.from(
        { length: limit * 2 },
        generateFakeStory,
      );

      // Filter stories by tags (this is a placeholder implementation)
      const filteredStories = allStories.filter((story) =>
        story.tags.some((storyTag) =>
          tags.includes(storyTag.name.toLowerCase()),
        ),
      );

      // Simulate cursor-based pagination
      const startIndex = cursor
        ? filteredStories.findIndex((story) => story.id === cursor) + 1
        : 0;
      const paginatedStories = filteredStories.slice(
        startIndex,
        startIndex + limit,
      );

      const nextCursor =
        paginatedStories[paginatedStories.length - 1]?.id ?? null;

      return {
        items: z.array(StorySchema).parse(paginatedStories),
        nextCursor,
      };
    }),

  getStoriesByAgent: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional(),
        cursor: z.string().optional(),
      }),
    )
    .output(
      z.object({
        items: z.array(StorySchema),
        nextCursor: z.string().nullable(),
      }),
    )
    .query(async ({ input }) => {
      const { limit = 10, cursor } = input;

      // Generate stories (you'll replace this with actual agent-based filtering)
      const allStories: Story[] = Array.from(
        { length: limit * 2 },
        generateFakeStory,
      );

      // Simulate cursor-based pagination
      const startIndex = cursor
        ? allStories.findIndex((story) => story.id === cursor) + 1
        : 0;
      const paginatedStories = allStories.slice(startIndex, startIndex + limit);

      const nextCursor =
        paginatedStories[paginatedStories.length - 1]?.id ?? null;

      return {
        items: z.array(StorySchema).parse(paginatedStories),
        nextCursor,
      };
    }),

  getStoriesByUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().min(1).max(100).optional(),
        cursor: z.string().optional(),
      }),
    )
    .output(
      z.object({
        items: z.array(StorySchema),
        nextCursor: z.string().nullable(),
      }),
    )
    .query(async ({ input }) => {
      const { userId, limit = 10, cursor } = input;

      // Generate stories (you'll replace this with actual user-based filtering)
      const allStories: Story[] = Array.from(
        { length: limit * 2 },
        generateFakeStory,
      );

      // Simulate cursor-based pagination
      const startIndex = cursor
        ? allStories.findIndex((story) => story.id === cursor) + 1
        : 0;
      const paginatedStories = allStories.slice(startIndex, startIndex + limit);

      const nextCursor =
        paginatedStories[paginatedStories.length - 1]?.id ?? null;

      return {
        items: z.array(StorySchema).parse(paginatedStories),
        nextCursor,
      };
    }),

  getTrendingStories: publicProcedure
    .output(z.array(StorySchema))
    .query(async () => {
      const stories: Story[] = Array.from({ length: 10 }, generateFakeStory);
      return z.array(StorySchema).parse(stories);
    }),

  getSuggestedStoriesByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .output(z.array(StorySchema))
    .query(async () => {
      const stories: Story[] = Array.from({ length: 10 }, generateFakeStory);
      return z.array(StorySchema).parse(stories);
    }),

  getSuggestedStoriesByStoryId: publicProcedure
    .input(z.object({ storyId: z.string() }))
    .output(z.array(StorySchema))
    .query(async () => {
      const stories: Story[] = Array.from({ length: 10 }, generateFakeStory);
      return z.array(StorySchema).parse(stories);
    }),

  getStoryTag: publicProcedure
    .input(z.object({ tagId: z.string() }))
    .output(TagSchema)
    .query(async () => {
      const tag: Tag = {
        id: faker.string.uuid(),
        name: faker.word.noun(),
        followers: faker.number.int({ min: 0, max: 10000 }),
        isFollowed: faker.datatype.boolean(),
        description: faker.lorem.sentence(),
      };
      return TagSchema.parse(tag);
    }),
});
