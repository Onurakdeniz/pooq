import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { faker } from '@faker-js/faker';

// Define TagSchema
const TagSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  followers: z.number().int().nonnegative(),
  isFollowed: z.boolean(),
  description: z.string(),
});

// Forward declaration of ProfileSchema to use it in ProfileSchema.lazy
let ProfileSchema: z.ZodTypeAny;

// Define ProfileSchema lazily to handle self-reference
ProfileSchema = z.object({
  fid: z.number().int(),
  custody_address: z.string(),
  username: z.string(),
  display_name: z.string(),
  pfp_url: z.string().url(),
  profile: z.object({
    bio: z.object({
      text: z.string(),
      mentioned_profiles: z.array(z.lazy(() => ProfileSchema)).optional(),
    }),
  }),
  follower_count: z.number().int().nonnegative(),
  following_count: z.number().int().nonnegative(),
  power_badge: z.boolean(),
  viewer_context: z.object({
    following: z.boolean(),
    followed_by: z.boolean(),
  }),
  tags: z.array(TagSchema),
  stories: z.number().int().nonnegative(),
  posts: z.number().int().nonnegative(),
});

// Derived TypeScript types
type Profile = z.infer<typeof ProfileSchema>;
type Tag = z.infer<typeof TagSchema>;

// Function to generate a fake profile
const generateFakeProfile = (): Profile => {
  return ProfileSchema.parse({
    fid: faker.number.int(),
    custody_address: faker.finance.ethereumAddress(),
    username: "john_doe",
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
    power_badge: faker.datatype.boolean(),
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

// Generate fake profiles
const fakeProfiles: Record<string, Profile> = Object.fromEntries(
  Array.from({ length: 10 }, () => {
    const profile = generateFakeProfile();
    return [profile.username, profile];
  })
);

// tRPC router
export const userRouter = createTRPCRouter({
  getUserByUserName: publicProcedure
    .input(z.object({ username: z.string() }))
    .output(ProfileSchema.nullable())
    .query(async ({ input: { username } }) => {
      return fakeProfiles[username] ?? null;
    }),
});
