import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { Prisma, PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


export const tagRouter = createTRPCRouter({
  getParentTagsByUser: publicProcedure
    .input(
      z.object({
        userFid: z.number().int().positive(),
      })
    )
    .query(async ({ input }) => {
      const { userFid } = input;

      try {
        const user = await prisma.user.findUnique({
          where: { fid: userFid },
          select: {
            parentTags: {
              select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                childTags: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true,
                  },
                },
              },
            },
          },
        });

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        return user.parentTags;
      } catch (error) {
        console.error('Error in getParentTagsByUser:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred while fetching parent tags',
          cause: error,
        });
      }
    }),
});