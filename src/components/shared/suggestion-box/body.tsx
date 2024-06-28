import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";
import React from "react";
import SuggestedItem, {SuggestedItemProps} from "./item"

interface SuggestionListProps {
  suggestions: SuggestedItemProps[];
}

const SuggestionList: React.FC<SuggestionListProps> = ({ suggestions }) => {
  return (
    <div className="flex flex-col gap-3 py-2">
 
      {suggestions.map((suggestion, index) => (
        <SuggestedItem key={index} {...suggestion} />
      ))}
 
 
    </div>
  );
};

export default SuggestionList;

 