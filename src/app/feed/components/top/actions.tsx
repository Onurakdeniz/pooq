import React from "react";
import FeedFilter from "./filter";
import FeedSort from "./sort";
import FeedLLM from "./llm";
import LlmModeToggle from "./llm-mode";
import LLMButton from "./llm-button";

const FeedActions = () => {
  return (
    <div className="flex items-center justify-end gap-2">
      <FeedFilter />
      <LLMButton/>
      <LlmModeToggle />
      
    </div>
  );
};

export default FeedActions;
