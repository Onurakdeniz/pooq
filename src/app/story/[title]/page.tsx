import { api } from "@/trpc/server";
import StoryClient from "./story-client";
import Link from "next/link";
import { TRPCError } from "@trpc/server";

function slugToPartialTitle(slug: string): string {
  return slug.replace(/-/g, ' ').toLowerCase();
}

export default async function StoryPage({ params }: { params: { title: string } }) {
  const decodedSlug = decodeURIComponent(params.title);
  const title = slugToPartialTitle(decodedSlug);
  
  try {
    const initialData = await api.story.getStoryWithPosts({
      title: title,
      limit: 10,
    });

    return <StoryClient 
      initialData={initialData} 
      title={initialData.story.title ?? 'Default Title'} 
    />;
  } catch (error) {
    if (error instanceof TRPCError && error.code === 'NOT_FOUND') {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen  text-primary/50 pb-48 ">
        <div className="text-center p-8 rounded-lg ">
            <h1 className="text-4xl font-bold  mb-4">Story Not Found</h1>
            <p className="text-xl  mb-8">
              {error.message}
            </p>
            <Link href="/" className=" font-bold py-2 px-4 border rounded transition duration-300">
              Back to Home
            </Link>
          </div>
        </div>
      );
    }
    
    // For other errors, you might want to throw them or handle them differently
    throw error;
  }
}