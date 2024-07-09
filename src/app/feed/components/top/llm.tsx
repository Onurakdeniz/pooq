"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/trpc/react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLLMFilterStore } from "@/store/llm-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const formSchema = z.object({
  text: z.string().min(1, "Please enter a description"),
});

type FormValues = z.infer<typeof formSchema>;

export const LLMForm = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [generatedTags, setGeneratedTags] = useState<Array<{ tag: string, explanation: string }>>([]);
  const [deletingTags, setDeletingTags] = useState<string[]>([]);

  const open = useLLMFilterStore((state) => state.open);
  const setOpen = useLLMFilterStore((state) => state.setOpen);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const { handleSubmit, formState: { isValid }, watch, reset } = form;
  const textValue = watch("text");

  const generateTags = api.llmFeed.generateTags.useMutation();
  const createLLMFeed = api.llmFeed.createLLMFeed.useMutation();
  const updateLLMFeed = api.llmFeed.updateLLMFeed.useMutation();
  const deleteLLMFeed = api.llmFeed.deleteLLMFeed.useMutation();
  const { data: feedsData, refetch: refetchUserFeeds, isLoading: isLoadingFeeds } = api.llmFeed.getUserFeeds.useQuery();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const onSubmit = async (data: FormValues) => {
    if (generatedTags.length === 0) {
      const result = await generateTags.mutateAsync({ text: data.text });
      if (result.success && result.data) {
        setGeneratedTags(result.data.tags.map((tag, index) => ({
          tag,
          explanation: result.data?.explanations[index] ?? "No explanation provided"
        })));
      }
    } else {
      await createLLMFeed.mutateAsync({ text: data.text, tags: generatedTags.map(t => t.tag) });
      reset();
      setGeneratedTags([]);
      setMessage({ type: 'success', text: 'Feed created successfully!' });
      void refetchUserFeeds();
    }
  };

  const handleTagClick = (tag: string) => {
    setGeneratedTags(prev => prev.filter(t => t.tag !== tag));
  };

  const handleDeleteTag = async (feedId: string, tagToDelete: string) => {
    setDeletingTags(prev => [...prev, tagToDelete]);
    const feed = feedsData?.data?.find(f => f.id === feedId);
    if (feed) {
      const newTags = feed.tags.filter(tag => tag !== tagToDelete);
      await updateLLMFeed.mutateAsync({ id: feedId, text: feed.text, tags: newTags });
      setMessage({ type: 'success', text: 'Tag deleted successfully!' });
      void refetchUserFeeds();
    }
    setDeletingTags(prev => prev.filter(tag => tag !== tagToDelete));
  };

  const handleDeleteFeed = async (feedId: string) => {
    await deleteLLMFeed.mutateAsync({ id: feedId });
    setMessage({ type: 'success', text: 'Feed deleted successfully!' });
    void refetchUserFeeds();
  };

  if (!open) return null;

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full border-b pb-4"
    >
      <TabsList className="m-0 flex h-12 w-full items-center rounded-none border-b bg-inherit p-0">
        <div className="flex w-11/12 items-center justify-center gap-8 pl-12">
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="update">Update</TabsTrigger>
        </div>
        <Button
          variant="ghost"
          className="m-1 w-1/12 p-1 text-lg text-primary"
          value="close"
          onClick={() => setOpen()}
        >
          x
        </Button>
      </TabsList>
      {message && (
        <Alert className={`flex w-full items-center justify-center gap-6 rounded-none border-none ${message.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <TabsContent value="create">
        <div className="h-auto flex-col gap-2 px-8 py-2">
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="h-40 border py-4 text-primary/70 shadow-none focus-visible:ring-0"
                        placeholder="Create your personalized feed with natural language."
                        {...field}
                        disabled={generateTags.isPending || createLLMFeed.isPending || generatedTags.length > 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {generateTags.isPending || createLLMFeed.isPending ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              ) : generatedTags.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {generatedTags.map(({ tag, explanation }) => (
                    <TooltipProvider key={tag}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTagClick(tag)}
                            className="flex items-center gap-1"
                          >
                            {tag}
                            <span className="text-xs">&times;</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{explanation}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              )}
              {generateTags.error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{generateTags.error.message}</AlertDescription>
                </Alert>
              )}
              <div className="flex items-center justify-end gap-2">
                {generatedTags.length === 0 ? (
                  <Button
                    className="h-7"
                    variant="default"
                    type="submit"
                    disabled={generateTags.isPending || !isValid}
                  >
                    {generateTags.isPending ? "Generating..." : "Generate Feed Preferences"}
                  </Button>
                ) : (
                  <>
                    <Button
                      className="h-7"
                      variant="outline"
                      onClick={() => {
                        reset();
                        setGeneratedTags([]);
                      }}
                      type="button"
                      disabled={createLLMFeed.isPending}
                    >
                      Back
                    </Button>
                    <Button
                      className="h-7"
                      variant="default"
                      type="submit"
                      disabled={createLLMFeed.isPending || generatedTags.length === 0}
                    >
                      {createLLMFeed.isPending ? "Creating..." : "Create Personalized Feed"}
                    </Button>
                  </>
                )}
              </div>
            </form>
          </Form>
        </div>
      </TabsContent>
      <TabsContent value="update" className="h-full">
  <div className="">
    <ScrollArea className="h-[350px] pt-4 px-8 ">
      {isLoadingFeeds ? (
        Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="mb-4 rounded-xl bg-accent p-4">
            <Skeleton className="mb-2 h-4 w-3/4" />
            <Skeleton className="mb-2 h-4 w-1/2" />
            <div className="mb-2 flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-16" />
              ))}
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        ))
      ) : feedsData?.data && feedsData.data.length > 0 ? (
        <div className="flex flex-col gap-4">
          {feedsData.data.map((feed) => (
            <div key={feed.id} className="mb-4 rounded-xl bg-accent p-4">
              <p className="mb-2 text-sm text-primary/70">{feed.text}</p>
              <p className="mb-2 text-sm text-primary/50">
                Created at: {new Date(feed.createdAt).toLocaleString()}
              </p>
              <div className="mb-2 flex flex-wrap gap-2">
                {feed.tags.map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    className={`flex items-center gap-1 ${deletingTags.includes(tag) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={deletingTags.includes(tag)}
                  >
                    {tag}
                    <span 
                      className="text-xs cursor-pointer ml-1" 
                      onClick={() => !deletingTags.includes(tag) && handleDeleteTag(feed.id, tag)}
                    >
                      &times;
                    </span>
                  </Button>
                ))}
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteFeed(feed.id)}
                disabled={deleteLLMFeed.isPending && deleteLLMFeed.variables?.id === feed.id}
              >
                {deleteLLMFeed.isPending && deleteLLMFeed.variables?.id === feed.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-full flex-col items-center mt-20 justify-center text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-primary/60 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-lg font-semibold text-primary/60">No Personalized Feeds</p>
          <p className="text-sm text-primary/60 mt-2">
  You haven&apos;t created any personalized feeds yet. 
  Go to the &quot;Create&quot; tab to get started!
</p>
        </div>
      )}
    </ScrollArea>
  </div>
</TabsContent>
    </Tabs>
  );
};

export default LLMForm;