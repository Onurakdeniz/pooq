import ProfileAvatar from '@/components/shared/avatar'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import React from 'react'
import PostFooter from './footer'
import { Button } from '@/components/ui/button'
import { Bookmark, ChevronDown, ChevronUp, LoaderCircle, Minus, Plus, Reply } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Tag from '@/components/shared/tag'

const StoryPost = () => {
  return (
    <div className='flex-col flex gap-4 px-8'>
          <div className="flex h-8 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ProfileAvatar size="LARGE" />
           
            <time className="mb-1  text-xs font-normal  text-primary/60 sm:order-last text-end sm:mb-0">
                      just now
                    </time>
          </div>
         
            <div className=" flex items-cetner gap-2 text-xs text-primary/60">
            <Button variant={"ghost"} className="flex gap-1    font-light   items-center px-2 h-6 text-xs"  >
            <Bookmark size={16} strokeWidth={1} />
            <div>Bookmark</div>
      
          </Button>
          <Button variant={"ghost"} className="flex gap-1  font-light   items-center px-2 h-6 text-xs"  >
          <Reply size={16} strokeWidth={1}/>
        <div>Reply</div>

      </Button>
      <Button variant={"ghost"} className="flex justify-between gap-1 px-2   w-14  font-light   items-center  h-6 text-xs"  >
      <ChevronUp size={16} strokeWidth={1}/>
            <div>0</div>
 
          </Button>
            </div>
            
          </div>
   
        <div>
        <div className="flex w-full justify-between">
        <div className="flex w-12/12  pt-2 font-light text-pretty text-sm text-primary/60">
          Deneme Burada bi zun bir title Deneme Burada ikinci tane title var
          bayada uzun bir title Deneme Burada bi zun bir title DenemeDeneme
          Burada bi zun bir title Deneme Burada ikinci tane title var bayada
          uzun bir title Deneme Burada bi zun bir title DenemeDeneme Burada bi
          zun bir title Deneme Burada ikinci tane title var bayada uzun bir
          title Deneme Burada bi zun bir title Deneme
        </div>
     
      
        </div>
      
        </div>
        <PostFooter/>
    </div>
  )
}

export default StoryPost