import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { AuthorSchema } from "@/schemas";
import { NeynarUserResponse, fetchNeynarUsers } from "../lib/user";

const prisma = new PrismaClient();

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
        const neynarData = await fetchNeynarUsers(fids, viewerFid);

        if (!neynarData?.users) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch data from Neynar API",
          });
        }

        const authorPromises = suggestedUsers.map(async (user) => {
          const neynarUser = neynarData.users.find((u) => u.fid === user.fid);

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
            parentTags: true, // we do not need this
            categories: true, // we do not need this
            bookmarks: true, // we do not need this
            llmFeeds: true, // we do not need this
          },
        });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const neynarData = await fetchNeynarUsers([input.fid], viewerFid);
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
        console.log("neynaruser", neynarUser);

        if (!neynarUser) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Neynar user data is undefined",
          });
        }

        return AuthorSchema.parse({
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

  getProfileHover: publicProcedure
    .input(
      z.object({
        userName: z.string(),
      }),
    )
    .output(AuthorSchema)
    .query(async ({ ctx, input }) => {
      const { userName } = input;
      const viewerFid = ctx.userFid;

      try {
        const url = `https://api.neynar.com/v1/farcaster/user-by-username?username=${userName}${viewerFid ? `&viewerFid=${viewerFid}` : ""}`;
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            api_key: process.env.NEYNAR_API_KEY ?? "",
          },
        };

        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = (await response.json()) as NeynarUserResponse;

        if (!data.result?.user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const neynarUser = data.result.user;

        const [storyCount, postCount] = await Promise.all([
          prisma.story.count({ where: { authorId: neynarUser.fid } }),
          prisma.post.count({ where: { authorId: neynarUser.fid } }),
        ]);

        return AuthorSchema.parse({
          numberOfStories: storyCount,
          numberOfPosts: postCount,
          username: neynarUser.username,
          isUser: false,
          fid: neynarUser.fid,
          isRegistered: true,
          custodyAddress: neynarUser.custodyAddress,
          displayName: neynarUser.displayName,
          pfpUrl: neynarUser.pfp.url,
          followerCount: neynarUser.followerCount,
          followingCount: neynarUser.followingCount,
          verifications: neynarUser.verifications,
          verifiedAddresses: neynarUser.verifiedAddresses,
          activeStatus: neynarUser.activeStatus,
          powerBadge: neynarUser.powerBadge,
          viewerContext: neynarUser.viewerContext,
          bio: neynarUser.profile.bio.text,
        });
      } catch (error) {
        console.error("Error getting profile hover data:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "An unexpected error occurred while fetching profile hover data",
          cause: error,
        });
      }
    }),
});
