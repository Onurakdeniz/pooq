import React from 'react';
import { cn } from "@/lib/utils";
import {Tag} from "@/types"
 
 
type FeedDataTag = {
  id: string;
  name: string;
  description: string | null;
 
 
};

interface ProfileTagListProps {
  tags: FeedDataTag[];
}

const ProfileTagList: React.FC<ProfileTagListProps> = ({ tags }) => {
  return (
    <div className="flex items-center mt-12 text-primary/60 justify-center h-full">
      {tags.length > 0 ? (
        <ul>
          {tags.map(tag => (
            <li key={tag.id} className={cn("text-center text-primary-70", "text-base font-medium")}>
              {tag.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className={cn("text-center text-primary-70", "text-base font-medium")}>
          You can see your tags soon...
        </p>
      )}
    </div>
  );
};

export default ProfileTagList;