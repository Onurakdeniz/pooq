import { Prisma, PrismaClient, CastType } from '@prisma/client';
import { Pinecone } from '@pinecone-database/pinecone'

const prisma = new PrismaClient();

 

const pc = new Pinecone({ apiKey: "process.env.PINECONE"})
const index = pc.index("pinecone-index")


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
        create: entities.map((entity) => ({
          entity: {
            connectOrCreate: {
              where: { name: entity },
              create: { name: entity },
            },
          },
        })),
      },
      categories: {
        create: category.map((cat) => ({
          category: {
            connectOrCreate: {
              where: { name: cat },
              create: { name: cat },
            },
          },
        })),
      },
      tags: {
        create: tags.map((tag) => ({
          tag: {
            connectOrCreate: {
              where: { name: tag },
              create: { name: tag },
            },
          },
        })),
      },
    };

    let updatedItem;

    if (type === 'STORY') {
      updatedItem = await prisma.story.update({
        where: { id },
        data: {
          isProcessed: true,
          extraction: { create: extractionData },
          categories: {
            create: category.map((cat) => ({
              category: {
                connectOrCreate: {
                  where: { name: cat },
                  create: { name: cat },
                },
              },
            })),
          },
          tags: {
            create: tags.map((tag) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tag },
                  create: { name: tag },
                },
              },
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
      updatedItem = await prisma.post.update({
        where: { id },
        data: {
          isProcessed: true,
          extraction: { create: extractionData },
          tags: {
            create: tags.map((tag) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tag },
                  create: { name: tag },
                },
              },
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

    console.log(`Extraction created and ${type.toLowerCase()} updated:`, updatedItem);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error:', error.message);
    } else {
      console.error('Error creating extraction:', error);
    }
    throw error;
  }
}