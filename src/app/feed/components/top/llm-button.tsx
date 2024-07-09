// LLMButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useLLMFilterStore } from "@/store/llm-button";
import { Bot } from "lucide-react";

export const LLMButton = () => {
  const open = useLLMFilterStore((state) => state.open);
  const setOpen = useLLMFilterStore((state) => state.setOpen);

  const handleClick = () => {
    setOpen(); // This will toggle the open state
  };

  return (
    <Button
      className="h-7 flex items-center gap-2"
      variant={open ? "secondary" : "outline"}
      onClick={handleClick}
    >
      <Bot
        className={open ? "text-primary" : "text-muted-foreground"}
        size={16}
      />
 
    </Button>
  );
};

export default LLMButton;