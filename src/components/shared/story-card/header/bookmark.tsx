'use client'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Bookmark } from 'lucide-react'
import React, { useState } from 'react'
import { useWallets } from '@privy-io/react-auth'
import { toast } from 'sonner'
import dynamic from 'next/dynamic';

interface BookmarkStoryProps {
  id: string
}

const BookmarkStory: React.FC<BookmarkStoryProps> = ({ id : storyId }) => {
  const [isBookmarking, setIsBookmarking] = useState(false)
  const { wallets } = useWallets()
 
  const handleBookmark = async () => {
    setIsBookmarking(true)
    try {
      const wallet = wallets[0] // Assuming the first wallet is the active one
      if (!wallet) {
        toast("No wallet connected", {
          description: "Please connect a wallet to bookmark this story.",
        });
        return
      }

      const provider = await wallet.getEthereumProvider()
      const address = wallet.address

      const timestamp = Date.now()
      const message = `Bookmark Story Id ${storyId} at ${timestamp} timestamp`

      const signature = await provider.request({
        method: 'personal_sign',
        params: [message, address],
      }) as string; // Type assertion to string, assuming signature is a string
      
      // If you need to use 'dynamic', make sure it's used or remove it
      // const dynamic = ...
      
      // If you really need to keep an unused variable, prefix with underscore
      // const _dynamic = ...

      const bookmark = {
        storyId,
        userAddress: address,
        timestamp,
        signature
      }

      // Send the bookmark data to your API route
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookmark),
      });

      if (!response.ok) {
        throw new Error('Failed to save bookmark');
      }

      toast("Bookmark created", {
        description: "This story has been bookmarked successfully.",
      });
      
    } catch (error) {
      console.error("Error creating bookmark:", error)
      toast("Error", {
        description: "Failed to create bookmark. Please try again.",
      });
    } finally {
      setIsBookmarking(false)
    }
  }


  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"outline"}
              className="flex h-8 justify-center gap-2 font-light"
              size="icon"
              onClick={handleBookmark}
              disabled={isBookmarking}
            >
              <Bookmark size={20} strokeWidth={"1"} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bookmark this Story</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default BookmarkStory