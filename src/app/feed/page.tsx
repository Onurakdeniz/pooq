import { Suspense } from "react";
import { api } from "@/trpc/server";
import StoryList from "./components/list";
import FeedTop from "./components/top";
import { Story } from "@/types/type";

interface APIResponse {
  items: Story[];
  nextCursor: string | null;
}

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const limit = 10;
  const cursor = searchParams.cursor as string | undefined;

  // Extract category filters
  const categoryFilters = searchParams.filters
    ? (searchParams.filters as string).split(",")
    : undefined;

  // Extract LLM mode
  const llmMode = searchParams.llmMode === "true";

  try {
    const apiResponse = await api.story.getStories({
      limit,
      cursor,
      categoryFilters,
      llmMode,
    });

    console.log("apiResponse", apiResponse);

    const initialStories: Story[] = apiResponse.items;

    return (
      <div className="z-0 flex min-h-screen flex-col">
        <FeedTop />
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