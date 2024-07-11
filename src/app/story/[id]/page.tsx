import { api } from "@/trpc/server";
import StoryClient from "./story-client";

export default async function StoryPage({ params }: { params: { id: string } }) {
  const storyId =params.id
  const initialData = await api.story.getStoryWithPosts({
    storyId,
    limit: 10,
  });

  return <StoryClient initialData={initialData} storyId={storyId} />;
}