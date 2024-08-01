import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react";
import { PostWrite } from "./write";
import Link from "next/link";
import { StoryType } from "@prisma/client";
import renderIcon from "@/components/shared/story-icon";
 

interface StoryTopProps {
  title?: string;
  type?: StoryType | null;
}

const StoryTop = ({ title, type }: StoryTopProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sticky top-0 left-0 right-0 z-10  bg-background ">
      <div className="flex h-16 items-center justify-between border-b px-8">
        <Link href="/">
          <div className="flex items-center gap-4 text-primary/80">
            <Button variant={"outline"} size="icon">
              <ArrowLeft size="20" />
            </Button>

            {isScrolled ? (
              <div className="flex items-center gap-2">
                {type && renderIcon(type)}
                <span className="font-semibold">{title ?? "Untitled"}</span>
              </div>
            ) : (
              <span>Back Feed</span>
            )}
          </div>
        </Link>
        <div>
          <PostWrite />
        </div>
      </div>
    </div>
  );
};

export default StoryTop;