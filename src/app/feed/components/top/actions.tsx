import React from 'react'
import  FeedFilter  from './filter'
import FeedSort from './sort'
import FeedLLM from './llm'
import LlmModeToggle from './llm-mode'

const FeedActions = () => {
  return (
    <div className='flex gap-2 items-center justify-end'>

        <FeedFilter/>
        <FeedLLM/>
        <LlmModeToggle/>
     
    </div>
  )
}

export default FeedActions