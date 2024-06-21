import React from 'react'
import  FeedFilter  from './filter'
import FeedSort from './sort'
import FeedLLM from './llm'

const FeedActions = () => {
  return (
    <div className='flex gap-2 items-center justify-end'>

        <FeedFilter/>
        <FeedSort/>
        <FeedLLM/>
    </div>
  )
}

export default FeedActions