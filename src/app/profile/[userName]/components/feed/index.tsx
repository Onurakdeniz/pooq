import React from 'react'
import FeedHeader from './header'
import FeedCard from '@/app/feed/components/feed-card'
import { ScrollArea } from '@/components/ui/scroll-area'

const ProfileFeed = () => {
  return (
    <div>
      <FeedHeader/>
      <div>
      <ScrollArea className="flex h-screen flex-col     ">
      <div className="flex flex-col   ">
      <FeedCard />
      <FeedCard />
      <FeedCard />
      <FeedCard />
      <FeedCard />
      </div>
    </ScrollArea>
      </div>
    </div>
  )
}

export default ProfileFeed


 