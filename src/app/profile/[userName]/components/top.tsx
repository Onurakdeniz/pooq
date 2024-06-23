import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, SquarePen } from "lucide-react";
import React from "react";

const ProfileTop = () => {
  return (
    <div className="flex h-16 w-full items-center justify-between border-b px-8 ">
      <div className="flex items-center gap-4 text-primary/80">
        <span>PROFILE</span>
      </div>
      <div></div>
    </div>
  );
};

export default ProfileTop;
