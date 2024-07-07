export const maxDuration = 45;

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { PrismaClient } from '@prisma/client';
import type { CastFull } from '@/types/';
import type { CreateExtractionPayload } from "@/data/story";
import { createExtractionById } from "@/data/story";

const prisma = new PrismaClient();

interface LLMResponse {
  success: boolean;
  body: CreateExtractionPayload;
  error?: string;
}

interface WebhookData {
  created_at: number;
  type: string;
  data: CastFull;
}

interface EmbeddingPayload {
  type: string;
  hash: string;
  text: string;
  tags: string[];
  entities: string[];
  category: string[];
  storyId?: string;
}

interface EmbeddingResult {
  success: boolean;
  message: string;
  // Add more specific fields as needed
}

interface RelevanceCheckResult {
  success: boolean;
  body: string;
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

    // Determine the cast type
    let castType: 'story' | 'post' | 'ignore' = 'ignore';

    if (data.hash === data.thread_hash) {
      castType = 'story';
    } else {
      // Check if parent_hash is in the story database
      const storyExists = await prisma.story.findUnique({
        where: { hash: data.parent_hash! }
      });
    
      if (storyExists) {
        castType = 'post';
      }
    }

    if (castType === 'ignore') {
      console.log('Ignoring cast:', data.hash);
      return NextResponse.json({ success: true, message: 'Cast processing ignored' });
    }

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

    let savedItem;

    switch (castType) {
      case 'story':
        // Check if the story already exists
        savedItem = await prisma.story.findUnique({
          where: { hash: data.hash },
        });

        if (savedItem) {
          // If it exists, update it
          savedItem = await prisma.story.update({
            where: { hash: data.hash },
            data: {
              text: data.text,
              authorId: author.fid,
              isProcessed: false,
            },
          });
        } else {
          // If it doesn't exist, create a new one
          savedItem = await prisma.story.create({
            data: {
              hash: data.hash,
              text: data.text,
              authorId: author.fid,
              isProcessed: false,
            },
          });
        }
        break;

      case 'post':
        const parentStory = await prisma.story.findUnique({
          where: { hash: data.thread_hash }
        });

        if (!parentStory) {
          throw new Error('Parent story not found');
        }

        // Check if the post already exists
        savedItem = await prisma.post.findUnique({
          where: { hash: data.hash },
        });

        if (savedItem) {
          // If it exists, update it
          savedItem = await prisma.post.update({
            where: { hash: data.hash },
            data: {
              text: data.text,
              authorId: author.fid,
              isProcessed: false,
              storyId: parentStory.id,
            },
          });
        } else {
          // If it doesn't exist, create a new one
          savedItem = await prisma.post.create({
            data: {
              hash: data.hash,
              text: data.text,
              authorId: author.fid,
              isProcessed: false,
              storyId: parentStory.id,
            },
          });
        }
        break;
    }

    console.log(`Saved ${castType}:`, savedItem);

    const fleekprocessing = 'https://full-napkin-square.functions.on-fleek.app';

    // Perform the LLM request
    const llmResponse = await fetch(fleekprocessing, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: savedItem.id,
        text: savedItem.text,
        type: castType.toUpperCase(),
        hash: savedItem.hash
      }),
    });
    
    if (!llmResponse.ok) {
      throw new Error(`Failed to process ${castType} with LLM`);
    }
    
    const llmResult = (await llmResponse.json()) as LLMResponse;
    
    console.log('LLM Result:', llmResult);
    
    await createExtractionById(llmResult.body);

    const embeddingResult = await processEmbedding({
      data: {
        id: savedItem.hash,
        text: savedItem.text,
        hash: savedItem.hash,
        parentHash: castType === 'post' && data.parent_hash ? data.parent_hash : undefined
      },
      castType,
      llmResult
    });

    console.log("embeddingResult", embeddingResult);
    
    return NextResponse.json({
      success: true,
      llmResult,
      savedItem,
      embeddingResult
    });
    
  } catch (error: unknown) {
    console.error('Error processing cast:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

async function processEmbedding(params: {
  data: {
    id: string;
    text: string;
    hash: string;
    parentHash?: string;
  };
  castType: string;
  llmResult: LLMResponse;
}): Promise<EmbeddingResult> {
  try {
    const { data, castType, llmResult } = params;
    const fleekembedding = "https://refined-laptop-late.functions.on-fleek.app";
    const relevanceCheckUrl = "https://whining-planet-early.functions.on-fleek.app";
    
    const embeddingPayload: EmbeddingPayload = {
      type: castType.toUpperCase(),
      hash: data.hash,
      text: data.text,
      tags: llmResult.body.tags,
      entities: llmResult.body.entities,
      category: llmResult.body.category
    };
    
    if (castType.toLowerCase() === 'post' && data.parentHash) {
      embeddingPayload.storyId = data.parentHash;
    }
    
    const embedding = await fetch(fleekembedding, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(embeddingPayload),
    });

    if (!embedding.ok) {
      throw new Error(`Failed to process ${castType} with LLM`);
    }

    const embeddingResult = await embedding.json() as EmbeddingResult;

    // If the cast type is 'post', check for relevance
    if (castType.toLowerCase() === 'post' && data.parentHash) {
      const relevanceCheck = await fetch(relevanceCheckUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyHash: data.parentHash,
          postHash: data.hash
        }),
      });

      if (!relevanceCheck.ok) {
        throw new Error('Failed to check post relevance');
      }

      const relevanceResult = await relevanceCheck.json() as RelevanceCheckResult;
      console.log('Relevance check result:', relevanceResult);
         /* eslint-disable */
      if (relevanceResult.body) {
        const parsedBody = JSON.parse(relevanceResult.body);
        if (parsedBody.result?.isPostRelevant) {
          // Update the post in the database to set isStoryRelated to true
          await prisma.post.update({
            where: { hash: data.hash },
            data: { isStoryRelated: true },
          });
        }
      }
         /* eslint-disable */
    }

    return embeddingResult;

  } catch (error) {
    console.error("Error processing embedding:", error);
    throw error;
  }
}