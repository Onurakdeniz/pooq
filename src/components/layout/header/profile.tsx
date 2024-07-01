"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/theme-toggle";
import { usePrivy, useLogin } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();
  const { ready, authenticated, user, logout } = usePrivy();
  const { login } = useLogin({});

  if (!ready) {
    return <Skeleton className="mt-3 flex h-5 w-[160px] items-center" />;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const displayName = user?.farcaster?.displayName ?? user?.wallet?.address?.slice(0, 6) ?? "User";
  const userIdentifier = user?.farcaster?.fid ?? user?.wallet?.address;

  return (
    <>
      {ready && authenticated && user ? (
        <div className="flex w-full items-center justify-between gap-2 rounded-lg border px-4 py-2">
          <div className="flex flex-col">
            <div className="text-lg font-bold text-primary">pooq</div>
            <div className="text-xs text-primary/60">Idea Exchange</div>
          </div>
          <div className="flex items-center justify-end gap-2 ">
            <ModeToggle />
            <Avatar className="h-8 w-8">
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
              <AvatarImage src={user.farcaster?.pfp ?? ""} />
            </Avatar>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex items-center gap-1">
                  <div className="text-sm">{displayName}</div>
                  <ChevronDown size={16} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-44"
                side="bottom"
                align="end"
                sideOffset={15}
                alignOffset={0}
              >
                <DropdownMenuLabel>
                  {user.farcaster 
                    ? `FID: ${userIdentifier}` 
                    : `Address: ${typeof userIdentifier === 'string' ? userIdentifier.slice(0, 10) : userIdentifier}...`
                  }
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="text-lg font-bold text-primary">pooq</div>
            <div className="text-xs text-primary/60">Idea Exchange</div>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button onClick={login} className="rounded-md px-4 py-2">
              Login
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;