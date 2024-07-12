import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, SquarePen } from "lucide-react";
import React from "react";
import { PostWrite } from "./write";
import  Link from "next/link"

const StoryTop = () => {
  return (
    <div className="flex h-16 items-center justify-between   border-b px-8 ">
      <Link href="/">
      <div className="flex items-center gap-4 text-primary/80">
        <Button variant={"outline"} size="icon">
          <ArrowLeft size="20" />
        </Button>

        <span>Back Feed</span>
      </div>
      </Link>
      <div>
        <PostWrite />
      </div>
    </div>
  );
};

export default StoryTop;
