import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { observable } from '@trpc/server/observable';

const prisma = new PrismaClient();

// Define the type for the options parameter
interface RequestOptions {
  method: string;
  headers: Record<string, string>;
  body: string;
}

// Define the response type for the LLM endpoint
interface LLMResponse {
  code: number;
  body: {
    selectedTags: string[];
    explanations: string[];
    error?: string;
  };
}

// Import the sendRequest function
async function sendRequest(url: string, options: RequestOptions): Promise<LLMResponse> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json() as LLMResponse;
}

// Custom error for LLM endpoint
class LLMEndpointError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LLMEndpointError";
  }
}

export const llmFeedRouter = createTRPCRouter({
  generateTags: protectedProcedure
  .input(
    z.object({
      text: z.string().min(1).max(1000),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    if (!ctx.privyId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    let isLoading = true;
    let error: Error | null = null;
    let result: { text: string; tags: string[]; explanations: string[] } | null = null;

    try {
      const storyTags = await prisma.tag.findMany({
        where: {
          extractions: {
            some: {
              extraction: {
                storyId: { not: null }
              }
            }
          }
        },
        distinct: ["id"],
      });

      const tagNames = storyTags.map((tag) => tag.name);
      const suggestedTags = await callLLMEndpoint(input.text, tagNames);

      result = {
        text: input.text,
        tags: suggestedTags.selectedTags,
        explanations: suggestedTags.explanations,
      };
    } catch (err) {
      console.error("Error in generateTags:", err);
      error = err instanceof Error ? err : new Error("An unknown error occurred");
    } finally {
      isLoading = false;
    }

    return {
      isLoading,
      error: error ? error.message : null,
      data: result,
      success: !error,
    };
  }),
  createLLMFeed: protectedProcedure
    .input(
      z.object({
        text: z.string().min(1).max(1000),
        tags: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.privyId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      let isLoading = true;
      let error: Error | null = null;
      let result: { id: string; text: string; tags: string[] } | null = null;

      try {
        result = await ctx.db.$transaction(async (prisma) => {
          const createdFeed = await prisma.lLMFeed.create({
            data: {
              text: input.text,
              userId: ctx.privyId,
            },
          });

          const tagConnections = await Promise.all(
            input.tags.map(async (tagName: string) => {
              const tag = await prisma.tag.upsert({
                where: { name: tagName },
                update: {},
                create: { name: tagName },
              });
              return { id: tag.id };
            }),
          );

          const updatedLLMFeed = await prisma.lLMFeed.update({
            where: { id: createdFeed.id },
            data: {
              tags: {
                connect: tagConnections,
              },
            },
            include: { tags: true },
          });

          return {
            id: updatedLLMFeed.id,
            text: updatedLLMFeed.text,
            tags: updatedLLMFeed.tags.map((tag) => tag.name),
          };
        });
      } catch (err) {
        console.error("Error in createLLMFeed:", err);
        error = err instanceof Error ? err : new Error("An unknown error occurred");
      } finally {
        isLoading = false;
      }

      return {
        isLoading,
        error: error ? error.message : null,
        data: result,
        success: !error,
      };
    }),

  updateLLMFeed: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        text: z.string().min(1).max(1000),
        tags: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.privyId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      let isLoading = true;
      let error: Error | null = null;
      let result: { id: string; text: string; tags: string[] } | null = null;

      try {
        result = await ctx.db.$transaction(async (prisma) => {
          const updatedFeed = await prisma.lLMFeed.update({
            where: { id: input.id, userId: ctx.privyId },
            data: {
              text: input.text,
              tags: {
                set: [],
                connectOrCreate: input.tags.map((tagName) => ({
                  where: { name: tagName },
                  create: { name: tagName },
                })),
              },
            },
            include: { tags: true },
          });

          return {
            id: updatedFeed.id,
            text: updatedFeed.text,
            tags: updatedFeed.tags.map((tag) => tag.name),
          };
        });
      } catch (err) {
        console.error("Error in updateLLMFeed:", err);
        error = err instanceof Error ? err : new Error("An unknown error occurred");
      } finally {
        isLoading = false;
      }

      return {
        isLoading,
        error: error ? error.message : null,
        data: result,
        success: !error,
      };
    }),

  deleteLLMFeed: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.privyId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      let isLoading = true;
      let error: Error | null = null;
      let success = false;

      try {
        await ctx.db.lLMFeed.delete({
          where: { id: input.id, userId: ctx.privyId },
        });
        success = true;
      } catch (err) {
        console.error("Error in deleteLLMFeed:", err);
        error = err instanceof Error ? err : new Error("An unknown error occurred");
      } finally {
        isLoading = false;
      }

      return {
        isLoading,
        error: error ? error.message : null,
        success,
      };
    }),

  getUserFeeds: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.privyId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    let isLoading = true;
    let error: Error | null = null;
    let result: { id: string; text: string; tags: string[]; createdAt: Date; updatedAt: Date }[] | null = null;

    try {
      const feeds = await ctx.db.lLMFeed.findMany({
        where: { userId: ctx.privyId },
        include: { tags: true },
        orderBy: { createdAt: 'desc' },
      });

      result = feeds.map((feed) => ({
        id: feed.id,
        text: feed.text,
        tags: feed.tags.map((tag) => tag.name),
        createdAt: feed.createdAt,
        updatedAt: feed.updatedAt,
      }));
    } catch (err) {
      console.error("Error in getUserFeeds:", err);
      error = err instanceof Error ? err : new Error("An unknown error occurred");
    } finally {
      isLoading = false;
    }

    return {
      isLoading,
      error: error ? error.message : null,
      data: result,
      success: !error,
    };
  }),

  // New: Real-time feed updates
  feedUpdates: protectedProcedure.subscription(() => {
    return observable<{ type: 'created' | 'updated' | 'deleted', feed: { id: string; text: string; tags: string[] } }>((emit) => {
      const onUpdate = (data: { type: 'created' | 'updated' | 'deleted', feed: { id: string; text: string; tags: string[] } }) => {
        emit.next(data);
      };

      // Here you would set up your real-time update mechanism
      // For example, connecting to a WebSocket or using a pub/sub system

      return () => {
        // Cleanup function
        // Disconnect from WebSocket or unsubscribe from pub/sub
      };
    });
  }),
});

async function callLLMEndpoint(
  text: string,
  tags: string[],
): Promise<{ selectedTags: string[]; explanations: string[] }> {
  const url = "https://modern-lock-prehistoric.functions.on-fleek.app";

  try {
    console.log("callLLMEndpoint: Sending request to LLM endpoint");
    const response = await sendRequest(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, tags }),
    });

    console.log("callLLMEndpoint: Received response from LLM endpoint", response);

    if (response.code === 500 || response.body.error) {
      throw new LLMEndpointError(response.body.error ?? "Unknown error from LLM endpoint");
    }

    return {
      selectedTags: response.body.selectedTags,
      explanations: response.body.explanations,
    };
  } catch (error) {
    console.error("Error calling LLM endpoint:", error);
    throw error instanceof LLMEndpointError
      ? error
      : new LLMEndpointError("Error processing request from LLM endpoint");
  }
}