import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { faker } from "@faker-js/faker";
import { TagSchema, EntitySchema, UserBaseSchema, UserSchema, UserWithStoriesSchema, CastBaseSchema, CastSchema , StorySchema, StoriesSchema , hoverStorySchema , SuggestedStorySchema} from "@/schemas"
import { Tag,Entity , UserBase , User , HoverStory, Cast , CastBase , Story, Stories, UserWithStories , SuggestedStory } from "@/types"
import {fetchFromNeynarAPI} from "@/lib/lib"
import { Prisma, PrismaClient } from "@prisma/client";
import {StoriesResponse, Story as FStory ,Reactions, ReactionUser , CastType} from "@/types/type"
import { TRPCError } from '@trpc/server';

const prisma = new PrismaClient();

 
 

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
  text: faker.lorem.paragraphs({min:0 , max:5}),
  timestamp: faker.date.recent().toISOString(),
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
      type: faker.lorem.word(),
    })),
    isBookmarked: faker.datatype.boolean(),
    mentionedStories: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => faker.string.uuid()),
    author,
    cast: generateFakeCast(author),
    numberofPosts: faker.number.int({ min: 0, max: 100 }), // Added numberofPosts
  };
};


async function fetchHoverStoryById(storyId: string): Promise<HoverStory> {
  // Generate fake tags
  const tags = Array.from({ length: 3 }, () => ({
    id: faker.string.uuid(),
    name: faker.lorem.word(),
  }));

  // Generate a fake story
  return {
    id: storyId,
    title: faker.lorem.sentence(),
    timestamp: faker.date.past(),
    text: faker.lorem.paragraph(),
    authorFid: faker.datatype.number({ min: 1000, max: 9999 }),
    authorUserName: faker.internet.userName(),
    tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      id: faker.string.uuid(),
      name: faker.word.noun(),
      followers: faker.number.int({ min: 0, max: 10000 }),
      isFollowed: faker.datatype.boolean(),
      description: faker.lorem.sentence(),
    })),
    type: faker.word.sample(),
    numberofPosts: faker.number.int({ min: 0, max: 10 }),
  };
}


export function generateFakeSuggestedStory(): SuggestedStory {
  const tags = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
    id: faker.string.uuid(),
    name: faker.word.noun(),
    followers: faker.number.int({ min: 0, max: 10000 }),
    isFollowed: faker.datatype.boolean(),
    description: faker.lorem.sentence(),
  }));

  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    text: faker.lorem.paragraph(),
    timestamp: faker.date.past(),
    tags: tags,
    type: faker.word.sample(),
    numberofPosts: faker.number.int({ min: 0, max: 10 }),
  };
}

//////////////// routers  //////////////////////
type StoryWithRelations = Prisma.StoryGetPayload<{
  include: {
    extraction: {
      include: {
        tags: { include: { tag: true } };
        entities: { include: { entity: true } };
        categories: { include: { category: true } };
      };
    };
    bookmarks: true;
    tags: { include: { tag: true } };
    categories: { include: { category: true } };
    posts: {
      include: {
        extraction: {
          include: {
            tags: { include: { tag: true } };
            entities: { include: { entity: true } };
          };
        };
        tags: { include: { tag: true } };
        bookmarks: true;
      };
    };
  };
}>;


export const storyRouter = createTRPCRouter({
  getStories: publicProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).optional().default(10),
      cursor: z.string().optional(),
      userId: z.number().optional(),
      fid: z.number().optional(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const { limit, cursor, userId, fid } = input;
 

    try {
      // Fetch stories
      const dbStories = await prisma.story.findMany({
        where: {
          isProcessed: true,
          id: cursor ? { gt: parseInt(cursor) } : undefined,
        },
        orderBy: { id: 'asc' },
        take: limit + 1,
        include: {
          extraction: {
            include: {
              tags: { include: { tag: true } },
              entities: { include: { entity: true } },
              categories:  { include: { category: true } },
            },
          },
          bookmarks: userId ? { where: { userId }, select: { id: true } } : false,
        },
      });
    
      if (!dbStories || dbStories.length === 0) {
        return { items: [], nextCursor: null };
      }
    
      const hasNextPage = dbStories.length > limit;
      const stories = hasNextPage ? dbStories.slice(0, -1) : dbStories;
    
      // Fetch author story counts
      const authorIds = [...new Set(stories.map(story => story.authorId))];
      const authorStoryCounts = await prisma.story.groupBy({
        by: ['authorId'],
        where: { authorId: { in: authorIds } },
        _count: true,
      });

      const authorStoryCountMap = new Map(authorStoryCounts.map(count => [count.authorId, count._count]));

      // Fetch story posts counts
      const storyIds = stories.map(story => story.id);
      const storyPostsCounts = await prisma.post.groupBy({
        by: ['storyId'],
        where: { storyId: { in: storyIds } },
        _count: true,
      });

      const storyPostsCountMap = new Map(storyPostsCounts.map(count => [count.storyId, count._count]));

      // Fetch Neynar data
      const hashes = stories.map(story => story.hash);
      const neynarData = await fetchFromNeynarAPI(hashes, fid);
 
      const formatReactions = (reactions: Partial<Reactions>): Reactions => ({
        likes_count: reactions?.likes?.length ?? 0,
        recasts_count: reactions?.recasts?.length ?? 0,
        likes: reactions?.likes?.map((like) => ({
          fid: like.fid,
          fname: like.fname
        })) ?? [],
        recasts: reactions?.recasts?.map((recast) => ({
          fid: recast.fid,
          fname: recast.fname
        })) ?? [],
      });
      
      const formattedStories: FStory[] = stories.map((story, index) => {
        const thirdPartyData = neynarData[index];
        const extraction = story.extraction;
        const storyCount = authorStoryCountMap.get(story.authorId) ?? 0;
        const postsCount = storyPostsCountMap.get(story.id) ?? 0;
        
        return {
          id: story.id.toString(),
          title: extraction?.title ?? '',
          type: (extraction?.type as CastType) ?? CastType.POST,
          tags: extraction?.tags?.map(t => ({ id: t.tag.id, name: t.tag.name })) ?? [],
          entities: extraction?.entities?.map(e => ({ id: e.entity.id, name: e.entity.name })) ?? [],
          categories: extraction?.categories?.map(c => ({ id: c.category.id, name: c.category.name })) ?? [],
          isBookmarked: userId ? story.bookmarks.length > 0 : false,
          mentionedStories: extraction?.mentionedStories ?? [],
          numberofPosts: postsCount,
          author: {
            ...(thirdPartyData?.author ?? {}),
            numberOfStories: storyCount,
            numberOfPosts: 0,
            object: thirdPartyData?.author?.object ?? "user",
            username: thirdPartyData?.author?.username ?? "",
            fid: thirdPartyData?.author?.fid ?? 0,
            custody_address: thirdPartyData?.author?.custody_address ?? "",
            display_name: thirdPartyData?.author?.display_name ?? "",
            pfp_url: thirdPartyData?.author?.pfp_url ?? "",
            profile: thirdPartyData?.author?.profile ?? { bio: { text: "" } },
            follower_count: thirdPartyData?.author?.follower_count ?? 0,
            following_count: thirdPartyData?.author?.following_count ?? 0,
            verifications: thirdPartyData?.author?.verifications ?? [],
            verified_addresses: thirdPartyData?.author?.verified_addresses ?? { eth_addresses: [], sol_addresses: [] },
            active_status: thirdPartyData?.author?.active_status ?? "",
            power_badge: thirdPartyData?.author?.power_badge ?? false,
            viewer_context: thirdPartyData?.author?.viewer_context ?? { following: false, followed_by: false },
          },
          cast: thirdPartyData?.cast 
            ? {
                ...thirdPartyData.cast,
                reactions: formatReactions(thirdPartyData.cast.reactions),
              }
            : {
                parent_author: { fid: null },
                hash: "",
                thread_hash: "",
                parent_hash: null,
                text: "",
                timestamp: "",
                reactions: { likes_count: 0, recasts_count: 0, likes: [], recasts: [] },
                mentioned_profiles: [],
                viewer_context: { liked: false, recasted: false },
              },
        };
      });

      const nextCursor = hasNextPage && stories.length > 0
        ? stories[stories.length - 1]?.id?.toString() ?? null
        : null;

      return {
        items: formattedStories,
        nextCursor,
      };
    } catch (error) {
      console.error('Error in getStories:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while fetching stories',
        cause: error,
      });
    } finally {
      // Ensure disconnect even if an error occurs
      await prisma.$disconnect();
    }
  }),
 
  getStoryWithPosts: publicProcedure
  .input(
    z.object({
      storyId: z.string(),
      userId: z.number().optional(),
      fid: z.number().optional(),
      cursor: z.number().optional(),
      limit: z.number().default(10),
    })
  )
  .query(async ({ input }) => {
    const { storyId, userId, fid, cursor, limit } = input;

    try {
      const story = await prisma.story.findUnique({
        where: { id: parseInt(storyId) },
        include: {
          extraction: {
            include: {
              tags: { include: { tag: true } },
              entities: { include: { entity: true } },
              categories: { include: { category: true } },
            },
          },
          bookmarks: userId ? { where: { userId } } : false,
          tags: { include: { tag: true } },
          categories: { include: { category: true } },
        },
      });

      if (!story) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Story not found',
        });
      }

      const posts = await prisma.post.findMany({
        where: { storyId: parseInt(storyId) },
        orderBy: { createdAt: 'desc' },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          extraction: {
            include: {
              tags: { include: { tag: true } },
              entities: { include: { entity: true } },
            },
          },
          tags: { include: { tag: true } },
          bookmarks: userId ? { where: { userId } } : false,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem!.id;
      }

      const allHashes = [story.hash, ...posts.map(post => post.hash)];
      const neynarData = await fetchFromNeynarAPI(allHashes, fid);

      if (!neynarData || neynarData.length === 0) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch data from Neynar API',
        });
      }

      const storyNeynarData = neynarData[0];
      if (!storyNeynarData) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch story data from Neynar API',
        });
      }
 
      function formatReactions(reactions: Reactions | { likes: ReactionUser[], recasts: ReactionUser[] }): Reactions {
        if ('likes_count' in reactions && 'recasts_count' in reactions) {
          // It's already in the correct format
          return reactions;
        } else {
          // Convert to the expected format
          return {
            likes_count: reactions.likes.length,
            recasts_count: reactions.recasts.length,
            likes: reactions.likes,
            recasts: reactions.recasts
          };
        }
      }
  

      const formattedStory = {
        id: story.id.toString(),
        title: story.extraction?.title ?? '',
        type: (story.extraction?.type as CastType) ?? CastType.POST,
        tags: story.extraction?.tags?.map(t => ({ id: t.tag.id, name: t.tag.name })) ?? [],
        entities: story.extraction?.entities?.map(e => ({ id: e.entity.id, name: e.entity.name })) ?? [],
        categories: story.extraction?.categories?.map(c => ({ id: c.category.id, name: c.category.name })) ?? [],
        isBookmarked: userId ? story.bookmarks.length > 0 : false,
        mentionedStories: story.extraction?.mentionedStories ?? [],
        numberofPosts: await prisma.post.count({ where: { storyId: parseInt(storyId) } }),
        author: {
          ...(storyNeynarData.author ?? {}),
          numberOfStories: await prisma.story.count({ where: { authorId: story.authorId } }),
          numberOfPosts: 0, // You might want to fetch this from somewhere
          object: storyNeynarData.author?.object ?? "user",
          username: storyNeynarData.author?.username ?? "",
          fid: storyNeynarData.author?.fid ?? 0,
          custody_address: storyNeynarData.author?.custody_address ?? "",
          display_name: storyNeynarData.author?.display_name ?? "",
          pfp_url: storyNeynarData.author?.pfp_url ?? "",
          profile: storyNeynarData.author?.profile ?? { bio: { text: "" } },
          follower_count: storyNeynarData.author?.follower_count ?? 0,
          following_count: storyNeynarData.author?.following_count ?? 0,
          verifications: storyNeynarData.author?.verifications ?? [],
          verified_addresses: storyNeynarData.author?.verified_addresses ?? { eth_addresses: [], sol_addresses: [] },
          active_status: storyNeynarData.author?.active_status ?? "",
          power_badge: storyNeynarData.author?.power_badge ?? false,
          viewer_context: storyNeynarData.author?.viewer_context ?? { following: false, followed_by: false },
        },
        cast: storyNeynarData.cast 
          ? {
              ...storyNeynarData.cast,
              reactions: formatReactions(storyNeynarData.cast.reactions),
            }
          : {
              parent_author: { fid: null },
              hash: "",
              thread_hash: "",
              parent_hash: null,
              text: "",
              timestamp: "",
              reactions: { likes_count: 0, recasts_count: 0, likes: [], recasts: [] },
              mentioned_profiles: [],
              viewer_context: { liked: false, recasted: false },
            },
      };

      const formattedPosts = posts.map((post, index) => {
        const neynarIndex = index + 1;
        const postNeynarData = neynarData[neynarIndex];
        
        if (!postNeynarData) {
          console.warn(`No Neynar data found for post with hash ${post.hash}`);
          return null;
        }

        return {
          id: post.id.toString(),
          hash: post.hash,
          tags: post.tags.map(t => ({ id: t.tag.id, name: t.tag.name })),
          entities: post.extraction?.entities.map(e => ({ id: e.entity.id, name: e.entity.name })) ?? [],
          isBookmarkedByUser: userId ? post.bookmarks.length > 0 : false,
          author: postNeynarData.author,
          cast: postNeynarData.cast,
          isLikedByUser: postNeynarData.cast.viewer_context.liked,
          text: post.text,
        };
      }).filter((post): post is NonNullable<typeof post> => post !== null);

      return {
        story: formattedStory,
        posts: formattedPosts,
        nextCursor,
      };
    } catch (error) {
      console.error('Error in getStoryWithPosts:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while fetching story and posts',
        cause: error,
      });
    }
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
    .output(z.array(SuggestedStorySchema))
    .query(async ({ input }) => {
      const {userId} = input
      const stories = Array.from({ length: 5 }, generateFakeSuggestedStory);
      return z.array(SuggestedStorySchema).parse(stories);
    }),

 


  getSuggestedStoriesByStoryId: publicProcedure
    .input(z.object({ storyId: z.string() }))
    .output(z.array(SuggestedStorySchema))
    .query(async ({ input }) => {
      const {storyId} = input
      const stories = Array.from({ length: 5 }, generateFakeSuggestedStory);
      return z.array(SuggestedStorySchema).parse(stories);
    }),

    getHoverStory : publicProcedure
    .input(z.object({ storyId: z.string() }))
    .output(hoverStorySchema)
    .query(async ({ input }) => {
      const { storyId } = input;
      const story = await fetchHoverStoryById(storyId);
      return hoverStorySchema.parse(story);
    })

});
 