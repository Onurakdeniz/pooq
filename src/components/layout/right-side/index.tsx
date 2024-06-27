import SuggestionBox from '@/components/shared/suggestion-box'
import { cn } from '@/lib/utils'
import React from 'react'
import Profile from '../header/profile'
import AiBox from './ai-box'

export const RightSide = ({className} : {className?:string}) => {
  return (
    <div className={cn("text-white-500   flex-col flex gap-4 p-4 ", className)}>
        <Profile/>
        <AiBox/>
        <SuggestionBox type="FOLLOWERS"/>
        <SuggestionBox type="TAGS" />
    </div>
  )
}

 