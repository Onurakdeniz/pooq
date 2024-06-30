import { Prisma, PrismaClient, CastType } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateExtractionPayload {
  id: number;
  type: CastType;
  title: string;
  category: string[];
  tags: string[];
  entities: string[];
}

export async function createExtractionById(payload: CreateExtractionPayload): Promise<void> {
  const { id, title, category, tags, entities, type } = payload;

  try {
    const extractionData = {
      title,
      type,
      entities: {
        create: entities.map((name) => ({
          entity: {
            connectOrCreate: {
              where: { name },
              create: { name },
            },
          },
        })),
      },
      categories: {
        create: category.map((name) => ({
          category: {
            connectOrCreate: {
              where: { name },
              create: { name },
            },
          },
        })),
      },
      tags: {
        create: tags.map((name) => ({
          tag: {
            connectOrCreate: {
              where: { name },
              create: { name },
            },
          },
        })),
      },
    };

    if (type === 'STORY') {
      await prisma.story.update({
        where: { id },
        data: {
          isProcessed: true,
          extraction: { create: extractionData },
          categories: {
            connectOrCreate: category.map((name) => ({
              where: { categoryId_storyId: { categoryId: name, storyId: id } },
              create: { category: { connectOrCreate: { where: { name }, create: { name } } } },
            })),
          },
          tags: {
            connectOrCreate: tags.map((name) => ({
              where: { tagId_storyId: { tagId: name, storyId: id } },
              create: { tag: { connectOrCreate: { where: { name }, create: { name } } } },
            })),
          },
        },
        include: {
          extraction: {
            include: {
              entities: true,
              categories: true,
              tags: true,
            },
          },
          categories: true,
          tags: true,
        },
      });
    } else if (type === 'POST') {
      await prisma.post.update({
        where: { id },
        data: {
          isProcessed: true,
          extraction: { create: extractionData },
          tags: {
            connectOrCreate: tags.map((name) => ({
              where: { tagId_postId: { tagId: name, postId: id } },
              create: { tag: { connectOrCreate: { where: { name }, create: { name } } } },
            })),
          },
        },
        include: {
          extraction: {
            include: {
              entities: true,
              categories: true,
              tags: true,
            },
          },
          tags: true,
        },
      });
    } else {
      throw new Error(`Invalid type: ${type as string}`);
    }

    console.log(`Extraction created and ${type.toLowerCase()} updated for id:`, id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error:', error.message);
    } else {
      console.error('Error creating extraction:', error);
    }
    throw error;
  }
}