import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sailboat } from "lucide-react";
import React from "react";
import { PROFILE_TABS } from "@/lib/constants";
import { Author } from "@/types";
import Tag from "@/components/shared/tag";

interface ProfileProps {
  author: Author;
}

const Profile: React.FC<ProfileProps> = ({ author }) => {
  return (
    <div className="flex flex-col border-b px-8 py-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-16 w-16">
              <AvatarImage src={author.pfpUrl} alt={author.displayName} />
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{author.displayName}</h2>
              <p className="text-sm text-primary/70">@{author.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 items-center gap-2 rounded-lg border bg-inherit p-2 text-center text-sm text-primary/70">
              <span className="font-semibold">{author.numberOfStories}</span>
              <span>Stories</span>
            </div>
            <div className="flex h-8 items-center gap-2 rounded-lg border bg-inherit p-2 text-center text-sm text-primary/70">
              <Sailboat size={"16"} />
              <span className="font-semibold">{author.numberOfPosts}</span>
              <span>Posts</span>
            </div>
          </div>
          <div>
            <Button
              variant={"outline"}
              className="flex gap-2 border bg-accent font-bold text-primary/80"
            >
              <span>
                {author.viewerContent?.following ? "Unfollow" : "Follow"}
              </span>
            </Button>
          </div>
        </div>
        <div className="line-clamp-2 text-sm text-primary/60">
          {author.bio}
        </div>
        <div className="flex items-center gap-6">
          <div className="h-8 rounded-sm text-sm text-primary/70">
            <span className="font-semibold">{author.followerCount}</span>{" "}
            Followers
          </div>
          <div className="h-8 rounded-sm text-sm text-primary/70">
            <span className="font-semibold">{author.followingCount}</span>{" "}
            Following
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default Profile;
