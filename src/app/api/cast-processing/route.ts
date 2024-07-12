export const maxDuration = 60;

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { Prisma, PrismaClient, StoryType } from "@prisma/client";
import type { CastFull } from "@/types/types";
import type { CreateExtractionPayload } from "@/data/story";
import { createExtractionById } from "@/data/story";
import { setTimeout } from "timers/promises";

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
  castType: string;
  hash: string;
  text: string;
  tags: string[];
  entities: string[];
  category: string;
  storyHash?: string;
}

interface EmbeddingResult {
  success: boolean;
  message: string;
}

interface RelevanceCheckResult {
  success: boolean;
  body: string;
}

interface RelevanceCheckBody {
  result?: {
    isPostRelevant?: boolean;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const sig = req.headers.get("X-Neynar-Signature");
    if (!sig) {
      throw new Error("Neynar signature missing from request headers");
    }

    const webhookSecret = process.env.NEYNAR_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error(
        "Make sure you set NEYNAR_WEBHOOK_SECRET in your .env file",
      );
    }

    const hmac = createHmac("sha512", webhookSecret);
    hmac.update(body);

    const generatedSignature = hmac.digest("hex");
    const isValid = generatedSignature === sig;
    if (!isValid) {
      throw new Error("Invalid webhook signature");
    }

    let hookData: WebhookData;

    try {
      hookData = JSON.parse(body) as WebhookData;
      console.log("Received webhook data:", JSON.stringify(hookData, null, 2));
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error("Invalid JSON in request body");
    }

    if (!hookData.type || !hookData.data?.hash || !hookData.data?.text) {
      console.error(
        "Invalid data structure. Received:",
        JSON.stringify(hookData, null, 2),
      );
      throw new Error(
        "Invalid structure for WebhookData: missing required fields",
      );
    }

    const { data } = hookData;

    let castType: "STORY" | "POST" | "ignore" = "ignore";

    if (data.hash === data.thread_hash) {
      castType = "STORY";
    } else {
      const storyExists = await prisma.story.findUnique({
        where: { hash: data.parent_hash! },
      });

      if (storyExists) {
        castType = "POST";
      }
    }

    if (castType === "ignore") {
      console.log("Ignoring cast:", data.hash);
      return NextResponse.json({
        success: true,
        message: "Cast processing ignored",
      });
    }

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
      case "STORY":
        savedItem = await prisma.story.upsert({
          where: { hash: data.hash },
          update: {
            text: data.text,
            authorId: author.fid,
            isProcessed: false,
          },
          create: {
            hash: data.hash,
            text: data.text,
            authorId: author.fid,
            isProcessed: false,
          },
        });
        break;

      case "POST":
        const parentStory = await prisma.story.findUnique({
          where: { hash: data.thread_hash },
        });

        if (!parentStory) {
          throw new Error("Parent story not found");
        }

        savedItem = await prisma.post.upsert({
          where: { hash: data.hash },
          update: {
            text: data.text,
            authorId: author.fid,
            isProcessed: false,
            storyId: parentStory.id,
          },
          create: {
            hash: data.hash,
            text: data.text,
            authorId: author.fid,
            isProcessed: false,
            storyId: parentStory.id,
          },
        });
        break;
    }

    console.log(`Saved ${castType}:`, savedItem);

    const fleekprocessing = "https://full-napkin-square.functions.on-fleek.app";

    const llmResponse = await fetch(fleekprocessing, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: savedItem.id,
        text: savedItem.text,
        castType: castType.toUpperCase(),
        hash: savedItem.hash,
      }),
    });

    if (!llmResponse.ok) {
      throw new Error(`Failed to process ${castType} with LLM`);
    }

    const llmResult = (await llmResponse.json()) as LLMResponse;
    console.log("llmresult",llmResult)

    const extractionPayload: CreateExtractionPayload = {
      id: savedItem.id.toString(),
      hash: savedItem.hash,
      castType: castType,
      tags: Array.isArray(llmResult.body.tags) ? llmResult.body.tags : [],
      entities: Array.isArray(llmResult.body.entities)
        ? llmResult.body.entities
        : [],
      referenceWords: Array.isArray(llmResult.body.referenceWords)
        ? llmResult.body.referenceWords
        : [],
      referencePhrases: Array.isArray(llmResult.body.referencePhrases)
        ? llmResult.body.referencePhrases
        : [],
    };

    if (llmResult.body.title) {
      extractionPayload.title = llmResult.body.title;
    }

    if (llmResult.body.type) {
      extractionPayload.type = llmResult.body.type;
    }

    if (llmResult.body.description) {
      extractionPayload.description = llmResult.body.description;
    }

    if (llmResult.body.view) {
      extractionPayload.view = llmResult.body.view;
    }

    if (llmResult.body.category) {
      extractionPayload.category = llmResult.body.category;
    }

    const updateEntry = await createExtractionById(extractionPayload);

    console.log("updateEntry",updateEntry)

    const embeddingResult = await processEmbedding({
      data: {
        id: savedItem.hash,
        text: savedItem.text,
        hash: savedItem.hash,
        parentHash:
          castType === "POST" && data.parent_hash
            ? data.parent_hash
            : undefined,
      },
      castType,
      llmResult,
    });

    console.log("embeddingResult", embeddingResult);

    return NextResponse.json({
      success: true,
      llmResult,
      savedItem,
      embeddingResult,
    });
  } catch (error: unknown) {
    console.error("Error processing cast:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
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
  castType: "STORY" | "POST";
  llmResult: LLMResponse;
}): Promise<EmbeddingResult> {
  try {
    const { data, castType, llmResult } = params;
    const fleekembedding = "https://refined-laptop-late.functions.on-fleek.app";
    const relevanceCheckUrl =
      "https://whining-planet-early.functions.on-fleek.app";

    const embeddingPayload: EmbeddingPayload = {
      castType: castType,
      hash: data.hash,
      text: data.text,
      tags: llmResult.body.tags,
      entities: llmResult.body.entities,
      category: llmResult.body.category ?? "",
    };
    //check
    if (castType === "POST" && data.parentHash) {
      embeddingPayload.storyHash = data.parentHash;
    }

    const embedding = await fetch(fleekembedding, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(embeddingPayload),
    });

    if (!embedding.ok) {
      throw new Error(`Failed to process ${castType} with LLM`);
    }

    const embeddingResult = (await embedding.json()) as EmbeddingResult;
    console.log("Embedding processed successfully");

    await setTimeout(5000);

    if (castType === "POST" && data.parentHash) {
      const relevanceCheck = await fetch(relevanceCheckUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storyHash: data.parentHash,
          postHash: data.hash,
        }),
      });

      if (!relevanceCheck.ok) {
        throw new Error("Failed to check post relevance");
      }

      const relevanceResult =
        (await relevanceCheck.json()) as RelevanceCheckResult;
      console.log("Relevance check result:", relevanceResult);

      if (relevanceResult.body) {
        const parsedBody = JSON.parse(
          relevanceResult.body,
        ) as RelevanceCheckBody;
        if (parsedBody.result?.isPostRelevant) {
          await prisma.post.update({
            where: { hash: data.hash },
            data: { isStoryRelated: true },
          });
        }
      }
    }

    return embeddingResult;
  } catch (error) {
    console.error("Error processing embedding:", error);
    throw error;
  }
}
