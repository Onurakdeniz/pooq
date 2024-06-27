import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { faker } from "@faker-js/faker";
import { TagSchema, EntitySchema, UserBaseSchema, UserSchema, UserWithStoriesSchema, CastBaseSchema, CastSchema , StorySchema, StoriesSchema } from "@/schemas"
import { Tag,Entity , UserBase , User , Cast , CastBase , Story, Stories, UserWithStories } from "@/types"


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
