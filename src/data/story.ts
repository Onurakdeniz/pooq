import { Prisma, PrismaClient, StoryType } from "@prisma/client";

const prisma = new PrismaClient();

export interface CreateExtractionPayload {
  id:  string //;
  hash: string;
  castType: "STORY" | "POST";
  title?: string;
  description?: string;
  view?: string;
  type?: StoryType;
  tags?: string[];
  entities?: string[];
  category?: string;
  referenceWords?: { word: string; source: string }[];
  referencePhrases?: { phrase: string; source: string }[];
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
    category,
    tags = [],
    entities = [],
    referenceWords = [],
    referencePhrases = [],
  } = payload;

  try {
    const extractionData: Prisma.ExtractionCreateInput = {
      title: title ?? '',
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
      referenceWords: {
        create: referenceWords.map(({ word, source }) => ({
          word,
          source,
        })),
      },
      referencePhrases: {
        create: referencePhrases.map(({ phrase, source }) => ({
          phrase,
          source,
        })),
      },
    };

    if (castType === "STORY") {
      await prisma.story.update({
        where: { id: parseInt(id, 10) },
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
              referenceWords: true,
              referencePhrases: true,
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
              referenceWords: true,
              referencePhrases: true,
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
