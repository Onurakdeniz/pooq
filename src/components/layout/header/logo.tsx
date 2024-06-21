import React from "react";
import {LibraryBig} from "lucide-react"

const Logo : React.FC = () => {
  return <div className="md:text-xl lg:text-3xl font-extralight   px-2 flex gap-2 items-center text-emerald-500">
      <LibraryBig className="w-8 h-8" strokeWidth="1" />
    <span> STORY</span>
    
    </div>;
};

export default Logo;
