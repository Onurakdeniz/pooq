import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { PrismaClient } from "@prisma/client";
import { kv } from "@vercel/kv";
import {
  getStoryWithPostsOutputSchema,
  AuthorSchema,
} from "@/schemas";
import {
  constructWhereClause,
  fetchAndFormatStories,
  fetchAndFormatPosts,
  fetchAndFormatPostsWithStory,
} from "@/server/api/lib/story";
import { fetchNeynarUsers } from "@/server/api/lib/user";
import type {
  TrendingItem,
  HoverStory,
} from "@/types";

const prisma = new PrismaClient();

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
      const userFid = ctx.userFid;

      try {
        const whereClause = await constructWhereClause(ctx.db, cursor, categoryFilters, llmMode, tagName);
        const result = await fetchAndFormatStories(ctx.db, whereClause, limit, userId, userFid ?? undefined);
        return result;
      } catch (error) {
        console.error("Error in getStories:", error);
        if (error instanceof TRPCError) throw error;
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
    .query(async ({ input, ctx }) => {
      const { id, cursor, limit } = input;
      const userId = ctx.privyId;
      const userFid = ctx.userFid;

      try {
        const dbStory = await ctx.db.story.findUnique({
          where: { id },
          include: {
            extraction: {
              include: {
                tags: { include: { tag: true } },
                entities: { include: { entity: true } },
                categories: { include: { category: true } },
              },
            },
            bookmarks: userId ? { where: { userId }, select: { id: true, userId: true } } : false,
            author: true,
          },
        });

        if (!dbStory) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Story not found with id: ${id}`,
          });
        }

        const result = await fetchAndFormatPosts(ctx.db, id, cursor, limit, userId, userFid, dbStory);
        return {
          ...result,
          nextCursor: result.nextCursor ?? null,
        };
      } catch (error) {
        console.error("Error in getStoryWithPosts:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while fetching story and posts",
          cause: error,
        });
      }
    }),

  getTrendingStories: publicProcedure.query(async () => {
    const trendingStoriesData = await kv.get("trendingStories");
    if (!trendingStoriesData) return [];
    return typeof trendingStoriesData === "string" 
      ? JSON.parse(trendingStoriesData) as TrendingItem[]
      : trendingStoriesData as TrendingItem[];
  }),

  getStoriesByUser: publicProcedure
    .input(
      z.object({
        userFid: z.number().int().positive(),
        cursor: z.number(),
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { userFid, cursor, limit } = input;
      const viewerId = ctx.privyId;
      const viewerFid = ctx.userFid;

      try {
        const user = await ctx.db.user.findUnique({ where: { fid: userFid } });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const result = await fetchAndFormatStories(
            ctx.db,
            { isProcessed: true, authorId: userFid },
            limit,
            viewerId,
            viewerFid ?? undefined,
            cursor
          );

        return result;
      } catch (error) {
        console.error("Error in getStoriesByUser:", error);
        if (error instanceof TRPCError) throw error;
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
    .query(async ({ input, ctx }) => {
      const { userFid, cursor, limit } = input;
      const viewerId = ctx.privyId;
      const viewerFid = ctx.userFid;

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

        const result = await fetchAndFormatPostsWithStory(
          ctx.db,
          { authorId: userFid },
          limit,
          viewerId,
          viewerFid,
          cursor
        );

        return result;
      } catch (error) {
        console.error("Error in getPostsWithStoryByUser:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while fetching posts",
          cause: error,
        });
      }
    }),

  getSuggestedStoriesByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async () => {
      // Implement actual logic here
      return [];
    }),

  getMultipleHoverStories: publicProcedure
    .input(
      z.object({
        texts: z.array(z.string()),
      }),
    )
    .query(async ({ input, ctx }): Promise<HoverStory[]> => {
      const { texts } = input;
      const viewerFid = ctx.userFid;

      try {
        const hoverStories = await prisma.extraction.findMany({
          where: { title: { in: texts } },
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

        const filteredStories = hoverStories.filter(
          (extraction) => extraction.story !== null,
        );

        if (filteredStories.length === 0) return [];

        const authorFids = filteredStories.map(
          (extraction) => extraction.story!.author.fid,
        );

        const neynarData = await fetchNeynarUsers(authorFids, viewerFid);

        if (!neynarData?.users) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch data from Neynar API",
          });
        }

        const result = await Promise.all(
          filteredStories.map(async (extraction): Promise<HoverStory> => {
            const story = extraction.story!;
            const neynarUser = neynarData.users.find(
              (u) => u.fid === story.author.fid,
            );

            if (!neynarUser) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message: `Author with FID ${story.author.fid} not found`,
              });
            }

            const [storyCount, postCount] = await Promise.all([
              prisma.story.count({ where: { authorId: story.author.fid } }),
              prisma.post.count({ where: { authorId: story.author.fid } }),
            ]);

            const author = AuthorSchema.parse({
              numberOfStories: storyCount,
              numberOfPosts: postCount,
              username: neynarUser.username,
              isUser: false,
              fid: neynarUser.fid,
              isRegistered: true,
              custodyAddress: neynarUser.custody_address,
              displayName: neynarUser.display_name,
              pfpUrl: neynarUser.pfp_url,
              followerCount: neynarUser.follower_count,
              followingCount: neynarUser.following_count,
              verifications: neynarUser.verifications,
              verified_addresses: neynarUser.verified_addresses,
              activeStatus: neynarUser.active_status,
              powerBadge: neynarUser.power_badge,
              viewerContent: neynarUser.viewer_context,
              bio: neynarUser.profile.bio.text,
            });

            return {
              id: story.id,
              title: extraction.title,
              timestamp: story.createdAt.toISOString(),
              text: story.text,
              author: author,
              type: extraction.type ?? undefined,
              numberOfPosts: story.posts.length,
              description: extraction.description ?? "",
            };
          }),
        );

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