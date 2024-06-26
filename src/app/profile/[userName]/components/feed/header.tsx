"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback } from "react";
import { PROFILE_TABS } from "@/lib/constants";

const DEFAULT_TAB = 'Stories';

const ProfileHeader = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getActiveTab = useCallback(() => {
    return searchParams.get('tab') ?? DEFAULT_TAB;
  }, [searchParams]);

  const handleActiveTab = useCallback((title: string) => {
    const params = new URLSearchParams(searchParams);
    if (title === DEFAULT_TAB) {
      params.delete('tab');
    } else {
      params.set('tab', title);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const activeTab = getActiveTab();

  console.log(activeTab, "activetab");

  return (
    <div className="flex h-16 border-b px-8">
      <div className="flex w-full items-center gap-6 text-xs text-primary/60">
        {PROFILE_TABS.map((tab) => (
          <TooltipProvider key={tab.title}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"ghost"}
                  className={`w-26 flex h-10 gap-2 p-1 px-4
                    ${activeTab === tab.title ? "bg-accent" : ""}
                    ${activeTab !== tab.title ? "hover:bg-accent/20" : ""} `}
                  size="icon"
                  onClick={() => handleActiveTab(tab.title)}
                >
                  <tab.icon size={"16"} />
                  <div className="text-center">{tab.title}</div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tab.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default ProfileHeader;