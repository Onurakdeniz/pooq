import { Prisma, PrismaClient, CastType, StoryType } from "@prisma/client";

const prisma = new PrismaClient();

export interface CreateExtractionPayload {
  storyType: StoryType;
  id: number;
  hash: string;
  castType: "story" | "post";
  title: string;
  titleExplanation?: string;
  view?: string;
  type?: StoryType;
  mentionedStories?: string[];
  category?: string[];
  tags: string[];
  entities: string[];
}

export async function createExtractionById(
  payload: CreateExtractionPayload,
): Promise<void> {
  const {
    id,
    hash,
    castType,
    title,
    titleExplanation,
    view,
    type,
    mentionedStories,
    category,
    tags,
    entities,
  } = payload;

  try {
    const extractionData: Prisma.ExtractionCreateInput = {
      castType: castType.toUpperCase() as CastType,
      title,
      titleExplanation,
      view,
      type,
      mentionedStories: mentionedStories ?? [],
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
      categories:
        category && category.length > 0
          ? {
              create: category.map((name) => ({
                category: {
                  connectOrCreate: {
                    where: { name },
                    create: { name },
                  },
                },
              })),
            }
          : undefined,
    };

    if (castType === "story") {
      await prisma.story.update({
        where: { id },
        data: {
          hash,
          isProcessed: true,
          extraction: { create: extractionData },
          categories:
            category && category.length > 0
              ? {
                  connectOrCreate: category.map((name) => ({
                    where: {
                      categoryId_storyId: { categoryId: name, storyId: id },
                    },
                    create: {
                      category: {
                        connectOrCreate: { where: { name }, create: { name } },
                      },
                    },
                  })),
                }
              : undefined,
          tags: {
            connectOrCreate: tags.map((name) => ({
              where: { tagId_storyId: { tagId: name, storyId: id } },
              create: {
                tag: { connectOrCreate: { where: { name }, create: { name } } },
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
    } else if (castType === "post") {
      await prisma.post.update({
        where: { id },
        data: {
          hash,
          isProcessed: true,
          extraction: { create: extractionData },
          tags: {
            connectOrCreate: tags.map((name) => ({
              where: { tagId_postId: { tagId: name, postId: id } },
              create: {
                tag: { connectOrCreate: { where: { name }, create: { name } } },
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
