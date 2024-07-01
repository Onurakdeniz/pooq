import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sailboat } from "lucide-react";
import React from "react";
import { PROFILE_TABS } from "@/lib/constants";

interface IProfile {
  name: string;
  avatarUrl: string;
  followers: number;
  following: number;
  bio: string;
  userName: string;
  fid: number;
  custodyAddress: number;
  verifications: string[];
  verifiedEthAddresses: string[];
  activeStatus: boolean;
  powerBadge: boolean;
  viewer: {
    following: string;
    followedBy: string;
  };
}

interface IProfileAvatar {
  size: "NORMAL" | "LARGE";
  profile?: IProfile;
  badges?: string[];
}

 
const Profile = () => {
  return (
    <div className="flex flex-col border-b px-8 py-4 ">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between  ">
          <div className="flex items-center gap-2">
            
            
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 items-center gap-2 rounded-lg border bg-inherit p-2 text-center text-sm text-primary/70 ">
              <span className="font-semibold">12 </span>
              <span>Stories</span>
            </div>
            <div className="flex h-8 items-center gap-2 rounded-lg  border bg-inherit p-2 text-center text-sm text-primary/70 ">
              <Sailboat size={"16"} />
              <span className="font-semibold">123 </span>
              <span>Posts</span>
            </div>
          </div>
          <div>
            <Button
              variant={"outline"}
              className=" flex gap-2 border bg-accent font-bold text-primary/80"
            >
              <span>Follow</span>
            </Button>
          </div>
        </div>
        <div className="line-clamp-2 text-sm  text-primary/60 ">
 
        </div>
        <div className="flex items-center gap-6 ">
          <div className="h-8   rounded-sm  text-sm  text-primary/70">
           <span className="font-semibold">  12K </span> Followers
          </div>
          <div className="h-8   rounded-sm  text-sm  text-primary/70">
           <span className="font-semibold">  12K </span> Followers
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
