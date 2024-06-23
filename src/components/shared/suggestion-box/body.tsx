import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";
import React from "react";

const SuggestionBoxBody = () => {
  return (
    <div className="flex flex-col gap-3 py-2">
      <Item />
      <Item />
      <Item />
      <Item />
 
    </div>
  );
};

export default SuggestionBoxBody;

const Item = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2 items-center">
      <Badge variant="outline" className="  rounded-sm text-primary/60  px-2 py-1   text-xs  font-normal shadow-sm hover:cursor-pointer  ">
        AI Blockcian
      </Badge>
      <div className="flex gap-1 items-center text-xs text-primary/40">
      <User className="w-4 h-4"/>
         <span className="">22K</span>
      </div>
      </div>
      <Button className="flex w-20 h-6 shadow-none justify-between font-light text-xs px-3 text-primary/60   " variant="outline">
         <Plus className="w-4 h-4"/>
         <span>Add</span>
      </Button>
    </div>
  );
};