import React from "react";
import { Lightbulb } from "lucide-react";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <Lightbulb className="w-6 h-6 md:w-10 md:h-10" strokeWidth={1.5} />
      <div className="flex flex-col">
        <span className="text-lg md:text-xl lg:text-2xl font-bold lowercase">p<span className="font-bold">oo</span>q</span>
        <span className="text-xs md:text-sm text-primary/60">Idea Exchange</span>
      </div>
    </div>
  );
};

export default Logo;