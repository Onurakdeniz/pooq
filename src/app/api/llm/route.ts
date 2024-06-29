import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { Prisma, PrismaClient } from '@prisma/client';
import { CastFull , Tag,Category,Entity } from '@/types';
 

const prisma = new PrismaClient();

interface LLMResponse {
  success: boolean;
  body: CreateExtractionPayload;
  error?: string;
}

interface WebhookData {
  created_at: number;
  type: string;
  data:  CastFull
}


interface UpdateStoryPayload {
  id: number;
  title: string;
  category?: string[];
  tags: string[];
  entities: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const sig = req.headers.get('X-Neynar-Signature');
    if (!sig) {
      throw new Error('Neynar signature missing from request headers');
    }

    const webhookSecret = process.env.NEYNAR_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('Make sure you set NEYNAR_WEBHOOK_SECRET in your .env file');
    }

    const hmac = createHmac('sha512', webhookSecret);
    hmac.update(body);

    const generatedSignature = hmac.digest('hex');
    const isValid = generatedSignature === sig;
    if (!isValid) {
      throw new Error('Invalid webhook signature');
    }

    let hookData: WebhookData;

    try {
      hookData = JSON.parse(body) as WebhookData;
      console.log("Received webhook data:", JSON.stringify(hookData, null, 2));
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error('Invalid JSON in request body');
    }

    // Validate the structure
    if (!hookData.type || !hookData.data?.hash || !hookData.data?.text) {
      console.error("Invalid data structure. Received:", JSON.stringify(hookData, null, 2));
      throw new Error('Invalid structure for WebhookData: missing required fields');
    }

    const { data } = hookData;

    // Check if the author exists, if not create a new author
    let author = await prisma.author.findUnique({
      where: { fid: data.author.fid },
    });

    if (!author) {
      author = await prisma.author.create({
        data: {
          fid: data.author.fid,
          userName: data.author.username,
        },
      });
    }

    // Create a new story
    const story = await prisma.story.create({
      data: {
        hash: data.hash,
        text: data.text,
        authorId: author.fid,
        isProcessed: false,
      },
    });

    console.log('Saved story:', story);

    // Define the Fleek Functions URL
    const fleekFunctionUrl = 'https://full-napkin-square.functions.on-fleek.app';

    // Perform the LLM request
    const llmResponse = await fetch(fleekFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: story.id,
        text: story.text,
        type: "STORY",
        hash: story.hash
      }),
    });

    if (!llmResponse.ok) {
      throw new Error('Failed to process story with LLM');
    }

    const llmResult = await llmResponse.json() as LLMResponse;

    console.log('LLM Result:', llmResult);
 

    await createExtraction(llmResult.body)
  
   

    return NextResponse.json({
      success: true,
      llmResult,
      savedStory: story,
    });
  } catch (error: unknown) {
    console.error('Error processing story:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

interface CreateExtractionPayload {
  id: number;
  title: string;
  category: string[];
  tags: string[];
  entities: string[];
}


async function createExtraction(payload: CreateExtractionPayload): Promise<void> {
  const { id, title, category, tags, entities } = payload;

  try {
    const updatedStory = await prisma.story.update({
      where: { id },
      data: {
        extraction: {
          create: {
            title,
            type: "STORY",
            entities: {
              connectOrCreate: entities.map((entity) => ({
                where: { name: entity },
                create: { name: entity },
              })),
            },
            categories: {
              connectOrCreate: category.map((cat) => ({
                where: { name: cat },
                create: { name: cat },
              })),
            },
            tags: {
              connectOrCreate: tags.map((tag) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            },
          },
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

    console.log('Extraction created and story updated:', updatedStory);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error:', error.message);
    } else {
      console.error('Error creating extraction:', error);
    }
    throw error;
  }
}