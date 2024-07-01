import React from 'react'
import SuggestionBoxHeader from './header'
import SuggestionList from './body'
import SuggestionBoxFooter from './footer'
import {SUGGESTION_BOX_TYPES} from "@/lib/constants"
import { SuggestedItemProps } from './item'
 

interface ISuggestionBox {
    type: "USER" | "TAG" | "STORY"
    items?: SuggestedItemProps[] | StoryItemProps[]
}

const SuggestionBox = ({type, items}: ISuggestionBox) => {
  const {title, Icon, info} = SUGGESTION_BOX_TYPES[type]
  return (
    <div className='flex-col flex border rounded-lg p-4 gap-4'>       
        <SuggestionBoxHeader
          title={title}
          Icon={Icon}
          info={info}
        />
        {type === "STORY" ? (
          <div className="flex flex-col gap-2">
            {(items as StoryItemProps[]).map((item) => (
              <StoryItem key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <div className='text-sm text-primary/60 py-4 flex items-center'>  
    
          We need more registered users to suggest you users.
        </div>
        )}
        <SuggestionBoxFooter />
    </div>
  )
}

export default SuggestionBox


 
import Link from 'next/link'
import { UserPlus } from 'lucide-react'

export interface StoryItemProps {
  id: string
  text: string
}

const StoryItem: React.FC<StoryItemProps> = ({ id, text }) => {
  return (
    <Link href={`/story/${id}`} className="hover:bg-gray-100 p-2 rounded">
      <div className="text-sm font-medium text-gray-900">{text}</div>
    </Link>
  )
}

 