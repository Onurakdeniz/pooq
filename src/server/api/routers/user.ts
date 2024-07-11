import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { AuthorSchema } from "@/schemas";

const prisma = new PrismaClient();

interface NeynarApiResponse {
  users: {
    object: "user";
    username: string;
    fid: number;
    custody_address: string;
    display_name: string;
    pfp_url: string;
    profile: { bio: { text: string } };
    follower_count: number;
    following_count: number;
    verifications: string[];
    verified_addresses: string[];
    active_status: string;
    power_badge: string | null;
    viewer_context: {
      following: boolean;
      followed_by: boolean;
    };
  }[];
}

async function fetchNeynarData(
  fids: number[],
  viewerFid: number,
): Promise<NeynarApiResponse | null> {
  const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids.join(",")}&viewer_fid=${viewerFid}`;
  console.log(`Calling Neynar API: ${url}`);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      api_key: process.env.NEYNAR_API_KEY ?? "",
    }
  };

  try {
    const response = await fetch(url, options);
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response headers:`, response.headers);

    if (!response.ok) {
      const text = await response.text();
      console.error(`Error response body: ${text}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      throw new Error(`Unexpected content type: ${contentType}`);
    }

    const json = await response.json() as NeynarApiResponse;
    return json;
  } catch (error) {
    console.error("Error fetching from Neynar API:", error);
    throw error;
  }
}

export const userRouter = createTRPCRouter({
  getUserSuggestions: publicProcedure
  .output(z.array(AuthorSchema))
  .query(async ({ ctx }) => {
    const viewerFid = ctx.userFid;

    if (!viewerFid) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User FID is required",
      });
    }

    try {
      const currentUser = await prisma.user.findUnique({
        where: { fid: viewerFid },
        include: { parentTags: true },
      });

      if (!currentUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const currentUserTagIds = currentUser.parentTags.map((tag) => tag.id);

      const usersWithCommonTags = await prisma.user.findMany({
        where: {
          AND: [
            { id: { not: currentUser.id } },
            { parentTags: { some: { id: { in: currentUserTagIds } } } },
          ],
        },
        include: { parentTags: true },
        take: 5,
      });

      const suggestedUsers =
        usersWithCommonTags.length > 0
          ? usersWithCommonTags
          : await prisma.user.findMany({
              where: { id: { not: currentUser.id } },
              orderBy: { createdAt: "desc" },
              include: { parentTags: true },
              take: 5,
            });

      const fids = suggestedUsers
        .map((user) => user.fid)
        .filter((fid): fid is number => fid !== null);
      const neynarData = await fetchNeynarData(fids, viewerFid);

      if (!neynarData?.users) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch data from Neynar API",
        });
      }

      const authorPromises = suggestedUsers.map(async (user) => {
        const neynarUser = neynarData.users.find(
          (u) => u.fid === user.fid,
        );

        if (!neynarUser || user.fid === null) {
          return null;
        }

        const [storyCount, postCount] = await Promise.all([
          prisma.story.count({ where: { authorId: user.fid } }),
          prisma.post.count({ where: { authorId: user.fid } }),
        ]);

        return AuthorSchema.parse({
          numberOfStories: storyCount,
          numberOfPosts: postCount,
          object: "user",
          username: neynarUser.username,
          fid: neynarUser.fid,
          parentTags: user.parentTags.map((tag) => ({ id: tag.id, name: tag.name })),
          custody_address: neynarUser.custody_address,
          display_name: neynarUser.display_name,
          pfp_url: neynarUser.pfp_url,
          profile: neynarUser.profile,
          follower_count: neynarUser.follower_count,
          following_count: neynarUser.following_count,
          verifications: neynarUser.verifications,
          verified_addresses: neynarUser.verified_addresses,
          active_status: neynarUser.active_status,
          power_badge: neynarUser.power_badge,
          viewer_context: neynarUser.viewer_context,
        });
      });

      const authors = (await Promise.all(authorPromises)).filter(
        (author): author is z.infer<typeof AuthorSchema> => author !== null,
      );

      return authors;
    } catch (error) {
      console.error("Error getting user suggestions:", error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An unexpected error occurred while fetching user suggestions",
        cause: error,
      });
    } finally {
      await prisma.$disconnect();
    }
  }),

  getUserProfile: publicProcedure
    .input(z.object({ fid: z.number() }))
    .output(AuthorSchema)
    .query(async ({ ctx, input }) => {
      const viewerFid = ctx.userFid;

      if (!viewerFid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Viewer FID is required",
        });
      }

      try {
        const user = await prisma.user.findUnique({
          where: { fid: input.fid },
          include: {
            parentTags: true,
            categories: true,
            bookmarks: true,
            llmFeeds: true
          },
        });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const neynarData = await fetchNeynarData([input.fid], viewerFid);
        if (!neynarData?.users) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch data from Neynar API",
          });
        }

        const [storyCount, postCount] = await Promise.all([
          prisma.story.count({ where: { authorId: user.fid ?? undefined } }),
          prisma.post.count({ where: { authorId: user.fid ?? undefined } }),
        ]);

        const neynarUser = neynarData.users[0];

        if (!neynarUser) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Neynar user data is undefined",
          });
        }

        return AuthorSchema.parse({
          numberOfStories: storyCount,
          numberOfPosts: postCount,
          object: "user",
          username: neynarUser.username,
          fid: neynarUser.fid,
          parentTags: user.parentTags.map((tag) => ({ id: tag.id, name: tag.name })),
          custody_address: neynarUser.custody_address,
          display_name: neynarUser.display_name,
          pfp_url: neynarUser.pfp_url,
          profile: neynarUser.profile,
          follower_count: neynarUser.follower_count,
          following_count: neynarUser.following_count,
          verifications: neynarUser.verifications,
          verified_addresses: neynarUser.verified_addresses,
          active_status: neynarUser.active_status,
          power_badge: neynarUser.power_badge,
          viewer_context: neynarUser.viewer_context,
        });
      } catch (error) {
        console.error("Error getting user profile:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        if (error instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to fetch data from Neynar API: ${error.message}`,
            cause: error,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while fetching user profile",
          cause: error,
        });
      } finally {
        await prisma.$disconnect();
      }
    }),
});