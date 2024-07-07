import React from 'react'
import { cn } from "@/lib/utils"

const ProfileTagList = () => {
  return (
    <div className="flex items-center mt-12 text-primary/60 justify-center h-full">
      <p className={cn(
        "text-center text-primary-70",
        "text-base font-medium"
      )}>
        You can see your tags soon...
      </p>
    </div>
  )
}

export default ProfileTagList