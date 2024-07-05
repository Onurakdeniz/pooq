'use client'
import SuggestionBox from '@/components/shared/suggestion-box'
import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import Profile from '../header/profile'
import AiBox from './ai-box'
import { usePathname, useParams } from 'next/navigation'
import { StoryItemProps } from "@/components/shared/suggestion-box/"

interface SimilarStoriesResponse {
  similarStories: StoryItemProps[];
}

export const RightSide = ({className} : {className?:string}) => {
  const pathname = usePathname()
  const { id: storyId } = useParams();
  console.log("cons",storyId)
  const [similarStories, setSimilarStories] = useState<StoryItemProps[]>([]);

  useEffect(() => {
    const fetchSimilarStories = async () => {
      if (storyId) {
        try {
          const response = await fetch('/api/similar-stories', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ storyId }),
          });
          console.log("similarstories",response)
          if (response.ok) {
            const data = await response.json() as SimilarStoriesResponse;
            console.log("datara",data)
            setSimilarStories(data.similarStories);
          } else {
            console.error('Failed to fetch similar stories');
          }
        } catch (error) {
          console.error('Error fetching similar stories:', error);
        }
      }
    };

    void fetchSimilarStories();
  }, [storyId]);

  return (
    <div className={cn("text-white-500 flex-col flex gap-4 p-4 ", className)}>
      {pathname.startsWith('/story/') ? (
        // Story right side content
        <>
          <Profile/>
    
          {similarStories.length > 0 && (
            <SuggestionBox type="STORY" items={similarStories} />
          )}
        </>
      ) : pathname === '/' ? (
        // Home page right side content
        <>
          <Profile/>
          <SuggestionBox type="USER"/>
  
        </>
      ) : (
        // Default content for other pages
        <>
          <Profile/>
          <SuggestionBox type="USER"/>
     
        </>
      )}
    </div>
  )
}