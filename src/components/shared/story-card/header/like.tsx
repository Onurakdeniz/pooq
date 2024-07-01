
'use client'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ChevronUp } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from  "sonner"

const LikeButton = ({numberOfLikes} : {numberOfLikes:number}) => {
    const [isSignInMessageShown, setIsSignInMessageShown] = useState(false)
  
    const handleClick = () => {
      setIsSignInMessageShown(true)
      toast("You have to sign in with Farcaster signature. This feature is coming soon!") // Simple toast message
    }
  
 

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"outline"}
            className="flex h-8 w-20 gap-2 p-1 px-2 font-light"
            size="icon"
            onClick={handleClick}
          >
            <ChevronUp size={24} strokeWidth={"1"} />
            <div>{numberOfLikes}</div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isSignInMessageShown ? "Sign in required" : "Like Story"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default LikeButton