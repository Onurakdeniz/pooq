import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { faker } from "@faker-js/faker";
import { TrendingItem, Tag } from "@/types/index";
import { UserWithStories } from "./story";

// Helper function to generate dummy data
const generateDummyData = (): TrendingItem[] => {
  const tags: Tag[] = Array.from({ length: 5 }, (_, idx) => ({
    id: idx.toString(),
    name: faker.lorem.word(),
    followers: faker.number.int({ min: 1, max: 1000 }),
    description: faker.lorem.sentence(),
    isFollowed: faker.datatype.boolean(),
  }));

  const generateDummyUserWithStories = (): UserWithStories => ({
    object: "user",
    fid: faker.number.int(),
    custody_address: faker.finance.ethereumAddress(),
    username: faker.internet.userName(),
    display_name: faker.person.firstName(),
    pfp_url: faker.image.avatar(),
    profile: {
      bio: {
        text: faker.lorem.sentences({min:2, max:4}),
        mentioned_profiles: [],
      },
    },
    follower_count: faker.number.int({ min: 1, max: 3000 }),
    following_count: faker.number.int({ min: 1, max: 500 }),
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
    tags: tags,
    stories: faker.number.int({ min: 1, max: 20 }),
    posts: faker.number.int({ min: 1, max: 100 }),
  });

  const generateDummyStory = (): TrendingItem => ({
    storyId: faker.string.uuid(),
    title: faker.lorem.sentences({min:1, max:4}),
    text: faker.lorem.paragraphs(2),
    author: generateDummyUserWithStories(),
    likes: faker.number.int({ min: 1, max: 500 }),
  });

  return Array.from({ length: 20 }, generateDummyStory);
};

// Define TRPC router
export const trendingRouter = createTRPCRouter({
  getTrendingStories: publicProcedure.query(() => {
    return generateDummyData();
  }),
});