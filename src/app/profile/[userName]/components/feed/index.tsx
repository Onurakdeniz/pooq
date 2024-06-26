import React from 'react'
import ProfileHeader from './header'
import FeedCard from '@/components/shared/story-card'
import { ScrollArea } from '@/components/ui/scroll-area'

const ProfileFeed = () => {
  return (
    <div>
      <ProfileHeader/>
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


 