import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { faker } from "@faker-js/faker";
import {
  TagSchema,
  EntitySchema,
  UserBaseSchema,
  UserSchema,
  UserWithStoriesSchema,
  CastBaseSchema,
  CastSchema,
  StorySchema,
  StoriesSchema,
  hoverStorySchema,
  SuggestedStorySchema,
} from "@/schemas";
 
import { fetchFromNeynarAPI } from "@/lib/lib";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  StoriesResponse,
  Story as FStory,
  Reactions,
  ReactionUser,
  TrendingItem,
  Post,
  CastViewerContext,
  Author,
  Tag,
  Entity,
  Cast,
} from "@/types/type";
import { TRPCError } from "@trpc/server";
import {
  formatStory,
  formatCast,
  formatPost,
  formatAuthor,
  formatReactions,
} from "../lib";
import { kv } from "@vercel/kv";
import {
  GetStoryWithPostsInput,
  GetStoryWithPostsOutput,
  PostSchema,
  GetStoryWithPostsByUser,
} from "@/schemas/schema";

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

export interface PostWithStory {
  id: string;
  hash: string;
  tags: Tag[];
  entities: Entity[];
  isBookmarkedByUser: boolean;
  author: Author;
  cast: Cast;
  isLikedByUser: boolean;
  text: string;
  storyTitle: string;
  storyId: string;
}

type GetPostsWithStoryByUserOutput = {
  items: PostWithStory[];
  nextCursor: string | null;
};
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
    getStories : publicProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).optional().default(10),
      cursor: z.string().optional(),
      categoryFilters: z.array(z.string()).optional(),
      llmMode: z.boolean().optional(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const { limit, cursor, categoryFilters, llmMode } = input;
    const userId = ctx.privyId;
    const fid = ctx.userFid ? ctx.userFid : undefined;
    const cursorNumber = cursor ? parseInt(cursor, 10) : undefined;

    try {
      // Fetch user's LLM agent tags if in LLM mode
      let userLlmTags: string[] = [];
      if (llmMode && userId) {
        const userLlmFeed = await prisma.lLMFeed.findFirst({
          where: { userId },
          include: { tags: true },
        });
        userLlmTags = userLlmFeed?.tags.map(tag => tag.id) ?? [];
      }

      // Construct the where clause
      const whereClause: WhereClause = {
        isProcessed: true,
        id: cursorNumber ? { lt: cursorNumber } : undefined,
      };

      // Add category filter
      if (categoryFilters && categoryFilters.length > 0) {
        whereClause.categories = {
          some: {
            category: {
              name: { in: categoryFilters },
            },
          },
        };
      }

      // Add LLM mode filter
      if (llmMode && userLlmTags.length > 0) {
        whereClause.tags = {
          some: {
            tagId: { in: userLlmTags },
          },
        };
      }

      // Fetch stories from database
      const dbStories = await prisma.story.findMany({
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
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
        },
      });

      if (!dbStories || dbStories.length === 0) {
        return { items: [], nextCursor: null };
      }

      const hasNextPage = dbStories.length > limit;
      const stories = hasNextPage ? dbStories.slice(0, -1) : dbStories;

      // Fetch author story counts
      const authorIds = [...new Set(stories.map((story) => story.authorId))];
      const authorStoryCounts = await prisma.story.groupBy({
        by: ["authorId"],
        where: { authorId: { in: authorIds } },
        _count: true,
      });

      const authorStoryCountMap = new Map(
        authorStoryCounts.map((count) => [count.authorId, count._count]),
      );

      // Fetch story posts counts
      const storyIds = stories.map((story) => story.id);
      const storyPostsCounts = await prisma.post.groupBy({
        by: ["storyId"],
        where: { storyId: { in: storyIds } },
        _count: true,
      });

      const storyPostsCountMap = new Map(
        storyPostsCounts.map((count) => [count.storyId, count._count]),
      );

      // Fetch Neynar data
      const hashes = stories.map((story) => story.hash);
      const neynarData = await fetchFromNeynarAPI(hashes, fid);

      const formattedStories: FStory[] = stories.map((story, index) => {
        const thirdPartyData = neynarData[index];
        const storyCount = authorStoryCountMap.get(story.authorId) ?? 0;
        const postsCount = storyPostsCountMap.get(story.id) ?? 0;

        return formatStory(
          story,
          thirdPartyData,
          storyCount,
          postsCount,
          userId,
        );
      });

      const nextCursor =
        hasNextPage && stories.length > 0
          ? stories[stories.length - 1]?.id?.toString() ?? null
          : null;

      return {
        items: formattedStories,
        nextCursor,
      };
    } catch (error) {
      console.error("Error in getStories:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred while fetching stories",
        cause: error,
      });
    } finally {
      await prisma.$disconnect();
    }
  }),

  getStoryWithPosts: publicProcedure
    .input(GetStoryWithPostsInput)
    .output(GetStoryWithPostsOutput)
    .query(async ({ input, ctx }) => {
      const { storyId, cursor, limit } = input;
      const userId = ctx.privyId;
      const fid = ctx.userFid ? ctx.userFid : undefined;

      try {
        const story = await prisma.story.findUnique({
          where: { id: storyId },
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
            code: "NOT_FOUND",
            message: "Story not found",
          });
        }

        const posts = await prisma.post.findMany({
          where: { storyId: storyId },
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
            tags: { include: { tag: true } },
            bookmarks: userId ? { where: { userId } } : false,
          },
        });

        let nextCursor: number | null = null;
        if (posts.length > limit) {
          const nextItem = posts.pop();
          nextCursor = nextItem ? nextItem.id : null;
        }
        

        const allHashes = [story.hash, ...posts.map((post) => post.hash)];
        const neynarData = await fetchFromNeynarAPI(allHashes, fid);

        if (!neynarData || neynarData.length === 0) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch data from Neynar API",
          });
        }

        const storyCount = await prisma.story.count({
          where: { authorId: story.authorId },
        });
        const postsCount = await prisma.post.count({
          where: { storyId: storyId },
        });

        const formattedStory = formatStory(
          story,
          neynarData[0],
          storyCount,
          postsCount,
          userId,
        );

        const formattedPosts = posts
          .map((post, index) => {
            const neynarIndex = index + 1;
            const postNeynarData = neynarData[neynarIndex];

            if (!postNeynarData) {
              console.warn(
                `No Neynar data found for post with hash ${post.hash}`,
              );
              return null;
            }

            return PostSchema.parse({
              id: post.id.toString(),
              hash: post.hash,
              tags: post.tags.map((t) => ({ id: t.tag.id, name: t.tag.name })),
              entities:
                post.extraction?.entities.map((e) => ({
                  id: e.entity.id,
                  name: e.entity.name,
                })) ?? [],
              isBookmarked: userId ? post.bookmarks.length > 0 : false,
              author: formatAuthor(postNeynarData.author),
              cast: formatCast({
                ...postNeynarData.cast,
                reactions: {
                  likes_count: postNeynarData.cast.reactions.likes.length,
                  recasts_count: postNeynarData.cast.reactions.recasts.length,
                  likes: postNeynarData.cast.reactions.likes,
                  recasts: postNeynarData.cast.reactions.recasts,
                },
              }),
              isLikedByUser: postNeynarData.cast.viewer_context.liked,
              text: post.text,
              repliesCount: postNeynarData.cast.replies.count, // Add this line to include the repliesCount
            });
          })
          .filter((post): post is z.infer<typeof PostSchema> => post !== null);

        try {
          return GetStoryWithPostsOutput.parse({
            story: formattedStory,
            posts: formattedPosts.slice(0, limit),
            nextCursor: nextCursor,
          });
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error(
              "Zod validation error:",
              JSON.stringify(error.errors, null, 2),
            );
          }
          throw error;
        }
      } catch (error) {
        console.error("Error in getStoryWithPosts:", error);
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
        if (error instanceof TRPCError) {
          throw error; // Re-throw TRPCErrors
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "An unexpected error occurred while fetching story and posts",
          cause: error,
        });
      }
    }),

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
        limit: z.number().min(1).max(100).optional().default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { userFid, limit } = input;
      const viewerPrivyId = ctx.privyId; // PrivyId of the user viewing the profile
      const cursor = input.cursor ? parseInt(input.cursor, 10) : undefined;
      try {
        // Fetch the user based on fid
        const user = await prisma.user.findUnique({
          where: { fid: userFid },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const userId = user.id; // Use the user's id instead of privyId

        // Fetch stories from database for the specific user
        const dbStories = await prisma.story.findMany({
          where: {
            isProcessed: true,
            authorId: userFid, // Use authorId instead of authorFid
            id: cursor ? { lt: cursor } : undefined,
          },
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
            bookmarks: viewerPrivyId
              ? { where: { userId: viewerPrivyId } }
              : false,
          },
        });

        if (!dbStories || dbStories.length === 0) {
          return { items: [], nextCursor: null };
        }

        const hasNextPage = dbStories.length > limit;
        const stories = hasNextPage ? dbStories.slice(0, -1) : dbStories;

        // Fetch author story count
        const authorStoryCount = await prisma.story.count({
          where: { authorId: userFid }, // Use authorId instead of authorFid
        });

        // Fetch story posts counts
        const storyIds = stories.map((story) => story.id);
        const storyPostsCounts = await prisma.post.groupBy({
          by: ["storyId"],
          where: { storyId: { in: storyIds } },
          _count: true,
        });

        const storyPostsCountMap = new Map(
          storyPostsCounts.map((count) => [count.storyId, count._count]),
        );

        // Fetch Neynar data
        const hashes = stories.map((story) => story.hash);
        const neynarData = await fetchFromNeynarAPI(hashes, userFid);

        const formattedStories: FStory[] = stories.map((story, index) => {
          const thirdPartyData = neynarData[index];
          const postsCount = storyPostsCountMap.get(story.id) ?? 0;

          return formatStory(
            story,
            thirdPartyData,
            authorStoryCount,
            postsCount,
            userId,
          );
        });

        const nextCursor = 
        hasNextPage && stories.length > 0 && stories[stories.length - 1]?.id !== undefined
          ? (stories[stories.length - 1]!.id, 10) || null
          : null;
      
        return {
          items: formattedStories,
          nextCursor,
        };
      } catch (error) {
        console.error("Error in getStoriesByUser:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while fetching stories",
          cause: error,
        });
      } finally {
        await prisma.$disconnect();
      }
    }),
 

    getPostsWithStoryByUser: publicProcedure
    .input(GetStoryWithPostsByUser)
    .query(async ({ input, ctx }): Promise<GetPostsWithStoryByUserOutput> => {
      const { userFid, limit, cursor } = input;
      const viewerPrivyId = ctx.privyId;
  
      try {
        const user = await prisma.user.findUnique({
          where: { fid: userFid },
          select: { id: true, fid: true, userName: true },
        });
  
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }
  
        // Get posts by the user
        const posts = await prisma.post.findMany({
          where: {
            authorId: userFid,
            id: cursor ? { lt: parseInt(cursor, 10) } : undefined,
          },
          orderBy: { id: "desc" },
          take: limit + 1,
          include: {
            story: {
              select: {
                id: true,
                authorId: true,
                extraction: {
                  select: {
                    title: true,
                  },
                },
              },
            },
            extraction: {
              include: {
                tags: { include: { tag: true } },
                entities: { include: { entity: true } },
                categories: { include: { category: true } },
              },
            },
            bookmarks: viewerPrivyId
              ? { where: { userId: viewerPrivyId } }
              : false,
          },
        });
  
        if (!posts || posts.length === 0) {
          return { items: [], nextCursor: null };
        }
  
        const hasNextPage = posts.length > limit;
        const finalPosts = hasNextPage ? posts.slice(0, -1) : posts;
  
        const postHashes = finalPosts
          .map((post) => post.hash)
          .filter((hash): hash is string => !!hash);
        const neynarData = await fetchFromNeynarAPI(postHashes, userFid);
  
        console.log("Post hashes:", postHashes);
        console.log("Neynar data:", neynarData);
  
        const formattedPosts = finalPosts
          .map((post): PostWithStory | null => {
            const postNeynarData = neynarData.find(
              (data) => data?.cast.hash === post.hash
            );
  
            if (!postNeynarData?.author) {
              return null; // Filter out posts without an author
            }
  
            return {
              id: post.id.toString(),
              hash: post.hash,
              tags: post.extraction?.tags?.map((t) => ({
                id: t.tag.id,
                name: t.tag.name,
                description: t.tag.description ?? undefined,
                parentTagId: t.tag.parentTagId ?? undefined,
              })) ?? [],
              entities: post.extraction?.entities?.map((e) => ({
                id: e.entity.id,
                name: e.entity.name,
                description: e.entity.description ?? undefined,
              })) ?? [],
              isBookmarkedByUser: post.bookmarks.length > 0,
              author: postNeynarData.author, // Directly assign, it can be undefined
              cast: postNeynarData.cast as Cast,
              isLikedByUser: postNeynarData.cast.viewer_context.liked ?? false,
              text: post.text,
              storyTitle: post.story?.extraction?.title ?? '',
              storyId: post.storyId.toString(),
            };
          })
          .filter((post): post is PostWithStory => post !== null); // Filter out null values
  
          return {
            items: formattedPosts,
            nextCursor:
              hasNextPage && finalPosts.length > 0 && finalPosts[finalPosts.length - 1]?.id !== undefined
                ? finalPosts[finalPosts.length - 1]!.id.toString() // Convert number to string
                : null,
          };
          
      } catch (error) {
        console.error("Error in getPostsWithStoryByUser:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        });
      }
    }),

  getStoriesByAgent: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional(),
        cursor: z.number().optional(),
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

      // Implement actual logic here

      return {
        items: [],
        nextCursor: null,
      };
    }),

  getSuggestedStoriesByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .output(z.array(SuggestedStorySchema))
    .query(async ({ input }) => {
      const { userId } = input;
      // Implement actual logic here
      return [];
    }),

  getSuggestedStoriesByStoryId: publicProcedure
    .input(z.object({ storyId: z.string() }))
    .output(z.array(SuggestedStorySchema))
    .query(async ({ input }) => {
      const { storyId } = input;
      // Implement actual logic here
      return [];
    }),

  getHoverStory: publicProcedure
    .input(z.object({ storyId: z.string() }))
    .output(hoverStorySchema)
    .query(async ({ input }) => {
      const { storyId } = input;
      /* eslint-disable */
      return {} as any; // Replace with actual implementation
      /* eslint-disable */
    }),
});
