"use client";

import * as React from "react";
import { CheckIcon } from "@radix-ui/react-icons"; // Import the icon correctly
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, X } from "lucide-react"; // Adjust icons if necessary
import { toast } from "sonner";

const filters = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Artifical Intelligence",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

const FeedFilter = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<{ value: string; label: string }[]>(
    []
  );

  const selectedCount = value.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex  w-full items-center gap-2 ">
        
      <div className=" hidden lg:flex  items-center gap-1    ">
          {value.map((selectedFilter) => (
            <Button
              className="flex h-7 border-emerald-400 hover:dark:bg-emerald-950 dark:border-emerald-800 hover:bg-emerald-100 items-center justify-between gap-2 px-2 text-[10px]"
              variant="outline"
              key={selectedFilter.value}
              onClick={() => {
                setValue(value.filter((filter) => filter.value !== selectedFilter.value));
              }}
            >
              <span className="text-emerald-600">{selectedFilter.label}</span>
              <X className="h-3 w-3 text-emerald-500" />
            </Button>
          ))}
        </div>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            aria-expanded={open}
            className={`flex h-8 justify-between border shadow-none  px-3 gap-2 ${
              value.length > 0 ? 'bg-emerald-100 dark:bg-emerald-800 border-none dark:text-emerald-400 hover:bg-emerald-200 hover:dark:bg-emerald-700 text-sm text-emerald-600 hover:text-emerald-600' : ''
            }`}
          >
            <div className="flex max-w-20 items-center justify-between gap-2">
              <span className="  text-start text-xs">
                {value.length > 0 ? `${selectedCount} Selected` : "Filter"}
              </span>
              <Filter size="12" />
            </div>
          </Button>
        </PopoverTrigger>
      
      </div>

      <PopoverContent className="flex w-48 items-start justify-start p-0" align="start">
        <Command>
          <CommandInput placeholder="Filter" className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {filters.map((filter) => (
                <CommandItem
                  className="flex items-center justify-between"
                  key={filter.value}
                  value={filter.value}
                  onSelect={(currentValue) => {
                    const isSelected = value.some((item) => item.value === currentValue);

                    if (isSelected) {
                      setValue(value.filter((item) => item.value !== currentValue));
                    } else if (value.length >= 3) {
                      toast("You can select up to 3 filters", {
                        description: "Deselect an existing filter to add a new one.",
                      });
                    } else {
                      setValue([...value, { value: currentValue, label: filter.label }]);
                    }
                    setOpen(false);
                  }}
                >
                  <span>{filter.label}</span>
                  {value.some((item) => item.value === filter.value) && (
                    <CheckIcon className="h-4 w-4 text-emerald-500" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FeedFilter;
