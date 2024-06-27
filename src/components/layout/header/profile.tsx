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
  const { ready, authenticated, user, isModalOpen, logout } = usePrivy();

  const displayName = user?.farcaster?.displayName ?? "User";

  // Fetching updated user data upon login completion
  const { login } = useLogin({
 
  });
  if (!ready) {
    return <Skeleton className="mt-3 flex h-5 w-[160px] items-center" />;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };
  return (
    <>
      {ready && authenticated ? (
        <div className="flex  w-full items-center  justify-between gap-2 rounded-lg border px-4 py-2">
          <div className="text-sm text-primary/60"> Hello </div>
          <div className="flex items-center justify-end gap-2 ">
            <ModeToggle />
            <Avatar className="h-8 w-8">
              <AvatarFallback> {displayName.charAt(0)} </AvatarFallback>
              <AvatarImage src={user?.farcaster?.pfp ?? ""} />
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
                  FID : {user?.farcaster?.fid}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>

                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ) : (
        <div className="flex w-3/12 items-center justify-end gap-2">
          <ModeToggle />
          <Button onClick={login} className="rounded-md px-4 py-2">
            Login
          </Button>
        </div>
      )}
    </>
  );
};

export default Profile;
