// app/feed/components/LlmModeToggle.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const LlmModeToggle = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLlmMode, setIsLlmMode] = useState(false);

  useEffect(() => {
    setIsLlmMode(searchParams.get('llmMode') === 'true');
  }, [searchParams]);

  const handleToggle = (checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (checked) {
      params.set('llmMode', 'true');
    } else {
      params.delete('llmMode');
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="llm-mode"
        checked={isLlmMode}
        onCheckedChange={handleToggle}
      />
 
    </div>
  );
};

export default LlmModeToggle;