
import { StoryType } from "@prisma/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { storyTypeIcons, storyTypeTooltips } from "@/lib/constants";


const renderIcon = (
    type: StoryType | null | undefined
) => {
    const IconComponent = type ? storyTypeIcons[type] : null;
  if (IconComponent) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-200 p-1.5 dark:border-emerald-950">
              <IconComponent className="text-emerald-600" strokeWidth={1.5} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{type && storyTypeTooltips[type]}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return null;
};

export default renderIcon;