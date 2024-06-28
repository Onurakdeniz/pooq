import { Info, CircleUser } from "lucide-react";
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ISuggestionBoxHeader {
  title: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  info: string;
}

const SuggestionBoxHeader: React.FC<ISuggestionBoxHeader> = ({
  title,
  Icon,
  info,
}) => {
  return (
    <div className="flex items-center justify-between  ">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5  text-primary/60" />
        <span className="text-base  font-light text-primary/60">{title}</span>
      </div>
      <HoverCard>
        <HoverCardTrigger>
          <Info className="h-4 w-4 text-primary/30" />
        </HoverCardTrigger>
        <HoverCardContent align="end" className="border-none" >
          <div className="flex text-xs text-primary/50"> 
              {info}
          </div>
        
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default SuggestionBoxHeader;
