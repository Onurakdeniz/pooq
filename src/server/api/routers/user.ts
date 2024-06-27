import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { faker } from '@faker-js/faker';
import {UserBase , UserWithStories} from "@/types"

// Define TagSchema
const TagSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  followers: z.number().int().nonnegative(),
  isFollowed: z.boolean(),
  description: z.string(),
});

// Define UserBaseSchema
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
// Define UserWithStoriesSchema
const UserWithStoriesSchema: z.ZodType<UserWithStories> = z.lazy(() =>
  UserBaseSchema.and(
    z.object({
      stories: z.number(),
      posts: z.number(),
    })
  )
);

// Derived TypeScript types
type Tag = z.infer<typeof TagSchema>;
 

// Function to generate a fake UserWithStories
const generateFakeUserWithStories = (): UserWithStories => {
  return UserWithStoriesSchema.parse({
    object: "user",
    fid: faker.number.int(),
    custody_address: faker.finance.ethereumAddress(),
    username: faker.internet.userName(),
    display_name: faker.person.firstName(),
    pfp_url: faker.image.avatar(),
    profile: {
      bio: {
        text: faker.lorem.sentence(),
        mentioned_profiles: [],
      },
    },
    follower_count: faker.number.int({ min: 0, max: 10000 }),
    following_count: faker.number.int({ min: 0, max: 1000 }),
    verifications: [],
    active_status: faker.helpers.arrayElement(["active", "inactive"]),
    power_badge: faker.datatype.boolean(),
    verified_addresses: {
      eth_addresses: [faker.finance.ethereumAddress()],
      sol_addresses: [faker.finance.ethereumAddress()],
    },
    viewer_context: {
      following: faker.datatype.boolean(),
      followed_by: faker.datatype.boolean(),
    },
    tags: Array.from({ length: 5 }, (): Tag => ({
      id: faker.string.uuid(),
      name: faker.lorem.word(),
      followers: faker.number.int({ min: 0, max: 1000 }),
      isFollowed: faker.datatype.boolean(),
      description: faker.lorem.sentence(),
    })),
    stories: faker.number.int({ min: 0, max: 50 }),
    posts: faker.number.int({ min: 0, max: 200 }),
  });
};

// Generate fake UserWithStories
const fakeUsers: Record<string, UserWithStories> = Object.fromEntries(
  Array.from({ length: 10 }, () => {
    const user = generateFakeUserWithStories();
    return [user.username, user];
  })
);

// tRPC router
export const userRouter = createTRPCRouter({
  getUserByUserName: publicProcedure
    .input(z.object({ username: z.string() }))
    .output(UserWithStoriesSchema.nullable())
    .query(async ({ input: { username } }) => {
      return fakeUsers[username] ?? null;
    }),
});