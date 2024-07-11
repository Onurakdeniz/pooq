// app/tag/page.tsx

import { Suspense } from "react";
import { api } from "@/trpc/server";

import { Story } from "@/types";
import StoryList from "../feed/components/list";
import TagTop from "./components/top";

interface APIResponse {
  items: Story[];
  nextCursor: string | null;
}

interface TagPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function TagPage({ searchParams }: TagPageProps) {
  const limit = 10;
  const cursor = searchParams.cursor as string | undefined;
  const tagName = searchParams.tag as string | undefined;

  // Extract category filters
  const categoryFilters = searchParams.filters
    ? (searchParams.filters as string).split(",")
    : undefined;

  // Extract LLM mode
  const llmMode = searchParams.llmMode === "true";

  if (!tagName) {
    return <div>No tag specified. Please provide a tag in the URL.</div>;
  }

  try {
    const apiResponse = await api.story.getStories({
      limit,
      cursor,
      categoryFilters,
      llmMode,
      tagName, // Add this to your existing API call
    });

    console.log("apiResponse", apiResponse);

    const initialStories: Story[] = apiResponse.items;

    return (
      <div className="z-0 flex min-h-screen flex-col">
        <TagTop tag={tagName} />
        <Suspense fallback={<div>Loading stories...</div>}>
          <StoryList
            initialStories={initialStories}
            searchParams={searchParams}
            initialCursor={apiResponse.nextCursor}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error fetching stories:", error);
    return <div>Error loading stories. Please try again later.</div>;
  }
}
