import React from "react";
import SideMenu from "./sidemenu";
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import TrendingStories from "./trending-stories";
import Logo from "../header/logo";

interface SideProps {
  className?: string;
 
}

export const LeftSide: React.FC<SideProps> = ({ className  }) => {
  return <div className={cn("text-white-500 border-r  h-full flex-col flex gap-8  px-4 pt-4 ", className)}>
    <div className="flex-col flex gap-4"> 
    <Logo/>
    <SideMenu   />
    </div>
    <TrendingStories/>
  </div>;
};
