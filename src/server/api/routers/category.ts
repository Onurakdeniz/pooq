import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ITEMS_PER_PAGE = 20;

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).default(ITEMS_PER_PAGE),
      })
    )
    .query(async ({ input }) => {
      const { cursor, limit } = input;
      
      try {
        const categories = await prisma.category.findMany({
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: {
            name: 'asc',
          },
          select: {
            id: true,
            name: true,
          },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (categories.length > limit) {
          const nextItem = categories.pop();
          nextCursor = nextItem!.id;
        }

        return {
          categories,
          nextCursor,
        };
      } catch (error) {
        console.error('Error in getAll:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred while fetching categories',
          cause: error,
        });
      }
    }),

  search: publicProcedure
    .input(
      z.object({
        term: z.string().min(1),
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).default(ITEMS_PER_PAGE),
      })
    )
    .query(async ({ input }) => {
      const { term, cursor, limit } = input;

      try {
        const categories = await prisma.category.findMany({
          where: {
            OR: [
              { name: { contains: term, mode: 'insensitive' } },
              { description: { contains: term, mode: 'insensitive' } },
            ],
          },
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: {
            name: 'asc',
          },
          select: {
            id: true,
            name: true,
          },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (categories.length > limit) {
          const nextItem = categories.pop();
          nextCursor = nextItem!.id;
        }

        return {
          categories,
          nextCursor,
        };
      } catch (error) {
        console.error('Error in search:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred while searching for categories',
          cause: error,
        });
      }
    }),
});