import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { faker } from '@faker-js/faker';

// Define base schemas
const TagSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  followers: z.number().int().nonnegative(),
  isFollowed: z.boolean(),
  description: z.string(),
});

const EntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

// Define recursive schemas
const UserSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    object: z.literal('user'),
    fid: z.number(),
    custody_address: z.string(),
    username: z.string(),
    display_name: z.string(),
    pfp_url: z.string(),
    profile: z.object({
      bio: z.object({
        text: z.string(),
        mentioned_profiles: z.array(z.lazy(() => UserSchema)).optional(),
      }),
    }),
    follower_count: z.number(),
    following_count: z.number(),
    verifications: z.array(z.string()),
    verified_addresses: z.object({
      eth_addresses: z.array(z.string()),
      sol_addresses: z.array(z.string()),
    }),
    active_status: z.enum(['active', 'inactive']),
    power_badge: z.boolean(),
    viewer_context: z.object({
      following: z.boolean(),
      followed_by: z.boolean(),
    }),
    tags: z.array(TagSchema),
  })
);

const CastSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    object: z.literal('cast'),
    hash: z.string(),
    thread_hash: z.string(),
    parent_hash: z.string().nullable(),
    parent_url: z.string().nullable(),
    root_parent_url: z.string().nullable(),
    parent_author: z.object({
      fid: z.number().nullable(),
    }),
    author: UserSchema,
    text: z.string(),
    timestamp: z.string(),
    embeds: z.array(
      z.object({
        url: z.string(),
      })
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
          })
        ),
        input: z.record(z.unknown()),
        state: z.record(z.unknown()),
        post_url: z.string(),
        frames_url: z.string(),
      })
    ),
    reactions: z.object({
      likes_count: z.number(),
      recasts_count: z.number(),
      likes: z.array(
        z.object({
          fid: z.number(),
          fname: z.string(),
        })
      ),
      recasts: z.array(
        z.object({
          fid: z.number(),
          fname: z.string(),
        })
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
    mentioned_profiles: z.array(UserSchema),
    viewer_context: z.object({
      liked: z.boolean(),
      recasted: z.boolean(),
    }),
    direct_replies: z.lazy(() => z.array(CastSchema)),
  })
);

const StorySchema = z.object({
  id: z.string(),
  title: z.string(),
  tags: z.array(TagSchema),
  entities: z.array(EntitySchema),
  isBookmarked: z.boolean(),
  mentionedStories: z.array(z.string()),
  author: UserSchema,
  cast: CastSchema,
});

// Derive types from schemas
type Tag = z.infer<typeof TagSchema>;
type Entity = z.infer<typeof EntitySchema>;
type User = z.infer<typeof UserSchema>;
type Cast = z.infer<typeof CastSchema>;
type Story = z.infer<typeof StorySchema>;

// Helper functions to generate fake data
const generateFakeUser = (): User => ({
  object: 'user',
  fid: faker.number.int(),
  custody_address: faker.finance.ethereumAddress(),
  username: faker.internet.userName().toLowerCase(),
  display_name: faker.person.fullName(),
  pfp_url: faker.image.avatar(),
  profile: {
    bio: {
      text: faker.lorem.sentence(),
      mentioned_profiles: [],
    },
  },
  follower_count: faker.number.int({ min: 0, max: 10000 }),
  following_count: faker.number.int({ min: 0, max: 1000 }),
  verifications: [faker.helpers.arrayElement(['email', 'phone', 'twitter'])],
  verified_addresses: {
    eth_addresses: [faker.finance.ethereumAddress()],
    sol_addresses: [faker.finance.ethereumAddress()], // Using Ethereum address as a placeholder
  },
  active_status: faker.helpers.arrayElement(['active', 'inactive']),
  power_badge: faker.datatype.boolean(),
  viewer_context: {
    following: faker.datatype.boolean(),
    followed_by: faker.datatype.boolean(),
  },
  tags: [],
});

const generateFakeCast = (author: User): Cast => ({
  object: 'cast',
  hash: faker.string.uuid(),
  thread_hash: faker.string.uuid(),
  parent_hash: faker.helpers.arrayElement([null, faker.string.uuid()]),
  parent_url: faker.helpers.arrayElement([null, faker.internet.url()]),
  root_parent_url: faker.helpers.arrayElement([null, faker.internet.url()]),
  parent_author: { fid: faker.helpers.arrayElement([null, faker.number.int()]) },
  author,
  text: faker.lorem.paragraph(),
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
    entities: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      id: faker.string.uuid(),
      name: faker.company.name(),
      description: faker.lorem.sentence(),
    })),
    isBookmarked: faker.datatype.boolean(),
    mentionedStories: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => faker.string.uuid()),
    author,
    cast: generateFakeCast(author),
  };
};

export const storyRouter = createTRPCRouter({
  getStories: publicProcedure
    .input(z.object({}))
    .output(z.array(StorySchema))
    .query(async ({ ctx }) => {
      // Generate an array of fake stories
      const stories: Story[] = Array.from({ length: 10 }, generateFakeStory);

      // Validate the data against the schema
      const parsedStories = z.array(StorySchema).parse(stories);
      
      return parsedStories;
    }),
});