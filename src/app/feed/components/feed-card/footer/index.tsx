import { Button } from '@/components/ui/button'
import { Bookmark, CircleUser } from 'lucide-react'
import React from 'react'

const CardFooter = () => {
  return (
    <div className='flex text-sm text-primary/70    items-center justify-end'>
       
       <Button variant={"ghost"} className="flex gap-1 bg-stone-200 hover:bg-stone-300  dark:bg-neutral-800 hover:dark:bg-neutral-700     items-center px-2 h-8 text-xs"  >
            <CircleUser size={16} strokeWidth={1} />
            <div>+22 Reponse More</div>
      
          </Button>
    </div>
  )
}

export default CardFooter