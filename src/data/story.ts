import { Prisma, PrismaClient, StoryType } from "@prisma/client";

const prisma = new PrismaClient();

export interface CreateExtractionPayload {
  type?: StoryType;
  id: string;
  hash: string;
  castType: "STORY" | "POST";
  title: string;
  description?: string;
  view?: string;
  mentionedStories?: string[];
  category?: string;
  tags: string[];
  entities: string[];
}

export async function createExtractionById(
  payload: CreateExtractionPayload
): Promise<void> {
  const {
    id,
    hash,
    castType,
    title,
    description,
    view,
    type,
    mentionedStories = [],
    category,
    tags = [],
    entities = [],
  } = payload;

  console.log("mentionedStories type:", typeof mentionedStories);
  console.log("category type:", typeof category);
  console.log("tags type:", typeof tags);
  console.log("entities type:", typeof entities);

  try {
    const extractionData: Prisma.ExtractionCreateInput = {
      title,
      description,
      view,
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
      categories: category
        ? {
            create: {
              category: {
                connectOrCreate: {
                  where: { name: category },
                  create: { name: category },
                },
              },
            },
          }
        : undefined,
    };

    if (castType === "STORY") {
      await prisma.story.update({
        where: { id },
        data: {
          hash,
          isProcessed: true,
          extraction: { create: extractionData },
        },
        include: {
          extraction: {
            include: {
              entities: true,
              categories: true,
              tags: true,
            },
          },
        },
      });
    } else if (castType === "POST") {
      await prisma.post.update({
        where: { id },
        data: {
          hash,
          isProcessed: true,
          extraction: { create: extractionData },
        },
        include: {
          extraction: {
            include: {
              entities: true,
              categories: true,
              tags: true,
            },
          },
        },
      });
    } else {
      throw new Error(`Invalid castType: ${castType as string}`);
    }

    console.log(`Extraction created and ${castType} updated for id:`, id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error:", error.message);
    } else {
      console.error("Error creating extraction:", error);
    }
    throw error;
  }
}