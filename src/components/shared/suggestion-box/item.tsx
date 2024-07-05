import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, User } from 'lucide-react'
import React from 'react'
import {SuggestedStory,SuggestedTag,SuggestedUser} from "@/types"



 
export type SuggestedItemType = "user" | "tag" | "other";

export type SuggestedItemProps =
  | { type: "user"; item: SuggestedUser }
  | { type: "tag"; item: SuggestedTag }
  | { type: "story"; item: SuggestedStory };

  const SuggestedItem: React.FC<SuggestedItemProps> = ({ item, type }) => {
    switch (type) {
      case 'user':
        return (
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <Badge
                variant="outline"
                className="rounded-sm text-primary/60 px-2 py-1 text-xs font-normal shadow-sm hover:cursor-pointer"
              >
                {item.name}
              </Badge>
              <div className="flex gap-1 items-center text-xs text-primary/40">
                <User className="w-4 h-4" />
                <span>{item.followers}K</span>
              </div>
            </div>
            <Button className="flex w-20 h-6 shadow-none justify-between font-light text-xs px-3 text-primary/60" variant="outline">
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </Button>
          </div>
        );
      case 'tag':
        return (
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <Badge
                variant="outline"
                className="rounded-sm text-primary/60 px-2 py-1 text-xs font-normal shadow-sm hover:cursor-pointer"
              >
                {item.name}
              </Badge>
              <div className="flex gap-1 items-center text-xs text-primary/40">
                <User className="w-4 h-4" />
                <span>{item.followers}K</span>
              </div>
            </div>
            <Button className="flex w-20 h-6 shadow-none justify-between font-light text-xs px-3 text-primary/60" variant="outline">
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </Button>
          </div>
        );
      case 'story':
        return (
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <div className="text-xs text-primary/70">{item.title}</div>
            </div>
            <Button className="flex w-20 h-6 shadow-none justify-between font-light text-xs px-3 text-primary/60" variant="outline">
              <span>Details</span>
            </Button>
          </div>
        );
      default:
        return null;
    }
  };
  
  export default SuggestedItem;