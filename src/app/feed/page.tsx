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
          {initialStories.length > 0 ? (
            <StoryList
              initialStories={initialStories}
              searchParams={searchParams}
              initialCursor={apiResponse.nextCursor}
            />
          ) : (
            <div className="flex flex-grow items-center justify-center">
              <p className="text-center text-xl text-primary/50">No stories available</p>
            </div>
          )}
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error fetching stories:", error);
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-center text-lg text-red-500">Error loading stories. Please try again later.</p>
      </div>
    );
  }
}