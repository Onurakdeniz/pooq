import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sailboat } from "lucide-react";
import React from "react";

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

const profile = {
  name: "Alice Johnson",
  avatarUrl:
    "https://wrpcd.net/cdn-cgi/image/fit=contain,f=auto,w=144/https%3A%2F%2Fi.imgur.com%2FIzJxuId.jpg",
  followers: 450,
  following: 200,
  bio: "Tech enthusiast and software developer. Love to explore new technologies.",
  userName: "alice_j",
  fid: 101,
  custodyAddress: 1234567890,
  verifications: ["Twitter", "GitHub"],
  verifiedEthAddresses: ["0x1234567890abcdef1234567890abcdef12345678"],
  activeStatus: true,
  powerBadge: true,
  viewer: {
    following: "yes",
    followedBy: "no",
  },
};

const Profile = () => {
  return (
    <div className="flex flex-col border-b px-8 py-4 ">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between  ">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={profile.avatarUrl} />
            </Avatar>
            <div className="flex flex-col gap-1">
              <div>{profile.name}</div>
              <div className="text-xs">@{profile.userName}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border bg-inherit p-2 text-center text-sm text-primary/70 ">
              <Sailboat size={"16"} />
              <span className="font-semibold">12 </span>
              <span>Stories</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-inherit p-2 text-center text-sm text-primary/70 ">
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
        <div className="text-sm text-primary/60">
          i like crypto and hockey…writing at paragraph.xyz/@nfa /mfers
          /predictionmkts
        </div>
        <div className="flex items-center gap-4 ">
          <Badge
            variant={"secondary"}
            className="h-8 rounded-sm font-light text-primary/60"
          >
            12K Followers
          </Badge>
          <Badge
            variant={"secondary"}
            className="h-8 rounded-sm font-light text-primary/60"
          >
            12K Followers
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default Profile;
