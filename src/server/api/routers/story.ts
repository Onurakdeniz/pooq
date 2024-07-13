import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { faker } from "@faker-js/faker";
import {
  TagSchema,
  EntitySchema,
  StorySchema,
  SuggestedStorySchema,
} from "@/schemas";

import { fetchCastsFromNeynar } from "@/lib/lib";
import { Prisma, PrismaClient, StoryType } from "@prisma/client";
import {
  Reactions,
  ReactionUser,
  TrendingItem,
  Post,
  Author,
  Tag,
  Entity,
  PostWithStory,
  Story,
  HoverStory,
} from "@/types";
import { TRPCError } from "@trpc/server";

import { formatStory, formatPost } from "@/server/api/lib/story";
import { kv } from "@vercel/kv";
import { PostSchema, getStoryWithPostsOutputSchema } from "@/schemas";

const prisma = new PrismaClient();

interface WhereClause {
  isProcessed: boolean;
  id?: { lt: number };
  categories?: {
    some: {
      category: {
        name: { in: string[] };
      };
    };
  };
  tags?: {
    some: {
      tagId: { in: string[] };
    };
  };
}

type GetPostsWithStoryByUserOutput = {
  items: PostWithStory[];
  nextCursor: string | null;
};
//////////////// routers  //////////////////////

export const storyRouter = createTRPCRouter({
  getStories: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional().default(10),
        cursor: z.number().optional(),
        categoryFilters: z.array(z.string()).optional(),
        llmMode: z.boolean().optional(),
        tagName: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { limit, cursor, categoryFilters, llmMode, tagName } = input;
      const userId = ctx.privyId;
      const userFid = ctx.userFid ? ctx.userFid : undefined;

      try {
        // Fetch all LLM agent tags if in LLM mode
        let allLlmTags: string[] = [];
        if (llmMode) {
          const allLlmFeeds = await ctx.db.lLMFeed.findMany({
            include: { tags: true },
          });
          allLlmTags = Array.from(
            new Set(
              allLlmFeeds.flatMap((feed) => feed.tags.map((tag) => tag.id)),
            ),
          );
        }

        // Construct the where clause
        const whereClause: Prisma.StoryWhereInput = {
          isProcessed: true,
        };

        if (cursor) {
          whereClause.id = { lt: cursor };
        }

        const extractionFilter: Prisma.ExtractionWhereInput = {};

        if (categoryFilters && categoryFilters.length > 0) {
          extractionFilter.categories = {
            some: {
              category: {
                name: { in: categoryFilters },
              },
            },
          };
        }

        if (llmMode && allLlmTags.length > 0) {
          extractionFilter.tags = {
            some: {
              tag: {
                id: { in: allLlmTags },
              },
            },
          };
        }

        if (tagName) {
          extractionFilter.tags = {
            some: {
              tag: {
                name: tagName,
              },
            },
          };
        }

        // Only add the extraction filter if there are any conditions
        if (Object.keys(extractionFilter).length > 0) {
          whereClause.extraction = extractionFilter;
        }
        // Fetch stories from database
        const dbStories = await ctx.db.story.findMany({
          where: whereClause,
          orderBy: { id: "desc" },
          take: limit + 1,
          include: {
            extraction: {
              include: {
                tags: { include: { tag: true } },
                entities: { include: { entity: true } },
                categories: { include: { category: true } },
              },
            },
            bookmarks: userId ? { where: { userId } } : false,
            author: true,
          },
        });

        if (!dbStories || dbStories.length === 0) {
          return { items: [], nextCursor: null };
        }

        const hasNextPage = dbStories.length > limit;
        const stories = hasNextPage ? dbStories.slice(0, -1) : dbStories;

        // Fetch Neynar data
        const hashes = stories.map((story) => story.hash);
        const neynarData = await fetchCastsFromNeynar(hashes, userFid);

        if (!neynarData || neynarData.length === 0) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch data from Neynar API",
          });
        }

        const formattedStories = await Promise.all(
          stories.map(async (story, index) => {
            const storyNeynarData = neynarData[index];
            if (!storyNeynarData) {
              console.warn(
                `No Neynar data found for story with hash ${story.hash}`,
              );
              return null;
            }
            try {
              return await formatStory(story, storyNeynarData, userFid, userId);
            } catch (error) {
              console.error(
                `Error formatting story with hash ${story.hash}:`,
                error,
              );
              return null;
            }
          }),
        );

        const validFormattedStories = formattedStories.filter(
          (story): story is Story => story !== null,
        );

        const nextCursor =
          hasNextPage && stories.length > 0
            ? stories[stories.length - 1]?.id ?? null
            : null;

        return {
          items: validFormattedStories,
          nextCursor,
        };
      } catch (error) {
        console.error("Error in getStories:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while fetching stories",
          cause: error,
        });
      }
    }),

  getStoryWithPosts: publicProcedure
    .input(
      z.object({
        id: z.number(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .output(getStoryWithPostsOutputSchema)
    .query(
      async ({
        input,
        ctx,
      }): Promise<z.infer<typeof getStoryWithPostsOutputSchema>> => {
        const { id, cursor, limit } = input;
        const userId = ctx.privyId;
        const userFid = ctx.userFid ? ctx.userFid : undefined;

        try {
          // Fetch story from DB
          const dbStory = await ctx.db.story.findUnique({
            where: { id: id },
            include: {
              extraction: {
                include: {
                  tags: { include: { tag: true } },
                  entities: { include: { entity: true } },
                  categories: { include: { category: true } },
                },
              },
              bookmarks: userId
                ? { where: { userId }, select: { id: true, userId: true } }
                : false,
              author: true,
            },
          });

          if (!dbStory) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `Story not found with id: ${id}`,
            });
          }

          // Fetch posts from DB
          const posts = await ctx.db.post.findMany({
            where: { storyId: id },
            orderBy: { createdAt: "desc" },
            take: limit + 1,
            cursor: cursor ? { id: cursor } : undefined,
            include: {
              extraction: {
                include: {
                  tags: { include: { tag: true } },
                  entities: { include: { entity: true } },
                },
              },
              bookmarks: userId ? { where: { userId } } : false,
            },
          });

          let nextCursor: string | null = null;
          if (posts.length > limit) {
            const nextItem = posts.pop();
            nextCursor = nextItem ? nextItem.id : null;
          }

          // Fetch Neynar data
          const allHashes = [dbStory.hash, ...posts.map((post) => post.hash)];
          const neynarData = await fetchCastsFromNeynar(allHashes, userFid);

          if (!neynarData || neynarData.length === 0) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to fetch data from Neynar API",
            });
          }

          if (!neynarData[0]) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "No Neynar data found for the main story",
            });
          }

          // Format story
          const formattedStory = await formatStory(
            dbStory,
            neynarData[0],
            userFid,
            userId,
          );

          // Format posts
          const formattedPosts = await Promise.all(
            posts.map(async (post, index) => {
              const postNeynarData = neynarData[index + 1];
              if (!postNeynarData) {
                console.warn(
                  `No Neynar data found for post with hash ${post.hash}`,
                );
                return null;
              }
              try {
                return await formatPost(post, postNeynarData, userId);
              } catch (error) {
                console.error(
                  `Error formatting post with hash ${post.hash}:`,
                  error,
                );
                return null;
              }
            }),
          );

          const validFormattedPosts = formattedPosts.filter(
            (post): post is Post => post !== null,
          );

          return {
            story: formattedStory,
            posts: validFormattedPosts,
            nextCursor: nextCursor,
          };
        } catch (error) {
          console.error("Error in getStoryWithPosts:", error);
          if (error instanceof TRPCError) {
            throw error;
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "An unexpected error occurred while fetching story and posts",
            cause: error,
          });
        }
      },
    ),

  getTrendingStories: publicProcedure.query(async () => {
    const trendingStoriesData = await kv.get("trendingStories");
    if (!trendingStoriesData) {
      return [];
    }
    if (typeof trendingStoriesData === "string") {
      return JSON.parse(trendingStoriesData) as TrendingItem[];
    }
    return trendingStoriesData as TrendingItem[];
  }),

  getStoriesByUser: publicProcedure
    .input(
      z.object({
        userFid: z.number().int().positive(),
        cursor: z.number().optional(),
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { userFid, cursor, limit } = input;
      const viewerId = ctx.privyId;
      const viewerFid = ctx.userFid ? ctx.userFid : undefined;

      try {
        const user = await ctx.db.user.findUnique({
          where: { fid: userFid },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Fetch stories from database
        const stories = await ctx.db.story.findMany({
          where: {
            isProcessed: true,
            authorId: userFid,
          },
          orderBy: { createdAt: "desc" },
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          include: {
            author: true,
            extraction: {
              include: {
                tags: { include: { tag: true } },
                entities: { include: { entity: true } },
                categories: { include: { category: true } },
              },
            },
            bookmarks: viewerId ? { where: { userId: viewerId } } : false,
          },
        });

        let nextCursor: number | null = null;
        if (stories.length > limit) {
          const nextItem = stories.pop();
          nextCursor = nextItem ? nextItem.id : null;
        }

        // Fetch author story count
        const authorStoryCount = await ctx.db.story.count({
          where: { authorId: userFid },
        });

        // Fetch story posts counts
        const storyIds = stories.map((story) => story.id);
        const storyPostsCounts = await ctx.db.post.groupBy({
          by: ["storyId"],
          where: { storyId: { in: storyIds } },
          _count: true,
        });

        const storyPostsCountMap = new Map(
          storyPostsCounts.map((count) => [count.storyId, count._count]),
        );

        // Fetch Neynar data only if there are hashes
        const hashes = stories.map((story) => story.hash).filter(Boolean);
        const neynarData =
          hashes.length > 0
            ? await fetchCastsFromNeynar(hashes, viewerFid)
            : [];

        if (hashes.length > 0 && (!neynarData || neynarData.length === 0)) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch data from Neynar API",
          });
        }

        // Format stories
        const formattedStories = await Promise.all(
          stories.map(async (story, index) => {
            const storyNeynarData = neynarData[index];
            if (!storyNeynarData) {
              console.warn(
                `No Neynar data found for story with hash ${story.hash}`,
              );
              return null;
            }
            try {
              const postsCount = storyPostsCountMap.get(story.id) ?? 0;
              return await formatStory(story, storyNeynarData, viewerFid);
            } catch (error) {
              console.error(
                `Error formatting story with hash ${story.hash}:`,
                error,
              );
              return null;
            }
          }),
        );

        const validFormattedStories = formattedStories.filter(
          (story) => story !== null,
        );

        return {
          items: validFormattedStories,
          nextCursor: nextCursor,
        };
      } catch (error) {
        console.error("Error in getStoriesByUser:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while fetching stories",
          cause: error,
        });
      }
    }),

  getPostsWithStoryByUser: publicProcedure
    .input(
      z.object({
        userFid: z.number(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .query(async ({ input, ctx }): Promise<GetPostsWithStoryByUserOutput> => {
      const { userFid, cursor, limit } = input;
      const viewerId = ctx.privyId;
      const viewerFid = ctx.userFid ? ctx.userFid : undefined;

      try {
        const user = await ctx.db.user.findUnique({
          where: { fid: userFid },
          select: { id: true, fid: true, userName: true },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Fetch posts from DB
        const posts = await ctx.db.post.findMany({
          where: { authorId: userFid },
          orderBy: { createdAt: "desc" },
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          include: {
            story: {
              include: {
                extraction: {
                  include: {
                    tags: { include: { tag: true } },
                    entities: { include: { entity: true } },
                    categories: { include: { category: true } },
                  },
                },
              },
            },
            extraction: {
              include: {
                tags: { include: { tag: true } },
                entities: { include: { entity: true } },
              },
            },
            bookmarks: viewerId ? { where: { userId: viewerId } } : false,
          },
        });

        let nextCursor: string | null = null;
        if (posts.length > limit) {
          const nextItem = posts.pop();
          nextCursor = nextItem ? nextItem.id : null;
        }

        // Fetch Neynar data
        const validPosts = posts.filter((post) => post.hash != null);
        const postHashes = validPosts.map((post) => post.hash);

        if (postHashes.length === 0) {
          console.warn("No valid post hashes found");
          return {
            items: [],
            nextCursor: null,
          };
        }

        const neynarData = await fetchCastsFromNeynar(postHashes, viewerFid);

        if (!neynarData || neynarData.length === 0) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch data from Neynar API",
          });
        }

        // Create a map of hash to Neynar data for easier lookup
        const neynarDataMap = new Map(
          neynarData.map((data) => [data.hash, data]),
        );

        // Format posts
        const formattedPosts = await Promise.all(
          posts.map(async (post) => {
            const postNeynarData = neynarDataMap.get(post.hash);
            if (!postNeynarData) {
              console.warn(
                `No Neynar data found for post with hash ${post.hash}`,
              );
              return null;
            }
            try {
              const formattedPost = await formatPost(
                post,
                postNeynarData,
                viewerId,
              );
              return {
                ...formattedPost,
                storyTitle: post.story?.extraction?.title ?? "",
                storyId: post.storyId,
              };
            } catch (error) {
              console.error(
                `Error formatting post with hash ${post.hash}:`,
                error,
              );
              return null;
            }
          }),
        );

        const validFormattedPosts = formattedPosts.filter(
          (post): post is PostWithStory => post !== null,
        );

        return {
          items: validFormattedPosts,
          nextCursor: nextCursor,
        };
      } catch (error) {
        console.error("Error in getPostsWithStoryByUser:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while fetching posts",
          cause: error,
        });
      }
    }),

  getSuggestedStoriesByUser: publicProcedure
    .input(z.object({ userId: z.string() }))

    .query(async ({ input }) => {
      const { userId } = input;
      // Implement actual logic here
      return [];
    }),

  getMultipleHoverStories: publicProcedure
    .input(
      z.object({
        texts: z.array(z.string()),
      }),
    )
    .query(async ({ input }): Promise<HoverStory[]> => {
      const { texts } = input;
      console.log("hoverinputs", texts);

      try {
        const hoverStories = await prisma.extraction.findMany({
          where: {
            title: {
              in: texts,
            },
          },
          select: {
            title: true,
            type: true,
            description: true,
            story: {
              select: {
                id: true,
                text: true,
                createdAt: true,
                author: {
                  select: {
                    fid: true,
                    userName: true,
                  },
                },
                posts: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        });

        const result = hoverStories
          .filter((extraction) => extraction.story !== null)
          .map((extraction): HoverStory => {
            const story = extraction.story!;
            return {
              id: story.id,
              title: extraction.title,
              timestamp: story.createdAt.toISOString(),
              text: story.text,
              authorFid: story.author.fid,
              authorUserName: story.author.userName,
              type: extraction.type ?? undefined,
              numberOfPosts: story.posts.length,
              description: extraction.description ?? "",
            };
          });

        return result;
      } catch (error) {
        console.error("Error fetching hover stories:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching hover stories",
        });
      } finally {
        await prisma.$disconnect();
      }
    }),
});
