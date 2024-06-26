"use client";

import * as React from "react";
import { CheckIcon } from "@radix-ui/react-icons";
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
import { Filter, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from 'next/navigation';

const filters = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Artificial Intelligence" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

const FeedFilter = () => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const getSelectedFilters = React.useCallback(() => {
    const filterParam = searchParams.get('filters');
    return filterParam ? filterParam.split(',') : [];
  }, [searchParams]);

  const selectedFilters = getSelectedFilters();

  const updateURL = React.useCallback((newFilters: string[]) => {
    const params = new URLSearchParams(searchParams);
    if (newFilters.length > 0) {
      params.set('filters', newFilters.join(','));
    } else {
      params.delete('filters');
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handleFilterToggle = (filterValue: string) => {
    const isSelected = selectedFilters.includes(filterValue);
    let newFilters: string[];

    if (isSelected) {
      newFilters = selectedFilters.filter(f => f !== filterValue);
    } else if (selectedFilters.length >= 3) {
      toast("You can select up to 3 filters", {
        description: "Deselect an existing filter to add a new one.",
      });
      return;
    } else {
      newFilters = [...selectedFilters, filterValue];
    }

    updateURL(newFilters);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex w-full items-center gap-2">
        <div className="hidden items-center gap-1 lg:flex">
          {selectedFilters.map((filterValue) => {
            const filter = filters.find(f => f.value === filterValue);
            return (
              <Button
                className="flex h-7 items-center justify-between gap-2 px-2 text-[10px] text-primary/70"
                variant="outline"
                key={filterValue}
                onClick={() => handleFilterToggle(filterValue)}
              >
                <span>{filter?.label}</span>
                <X className="h-3 w-3" />
              </Button>
            );
          })}
        </div>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            aria-expanded={open}
            className={`flex h-8 justify-between gap-2 border px-3 shadow-none ${
              selectedFilters.length > 0 ? "bg-primary/10 text-primary/60 dark:text-primary/70" : ""
            }`}
          >
            <div className="flex max-w-28 items-center justify-between gap-2">
              <span className="text-start">
                {selectedFilters.length > 0 ? `${selectedFilters.length} Selected` : "Filter"}
              </span>
              <Filter size="14" />
            </div>
          </Button>
        </PopoverTrigger>
      </div>

      <PopoverContent
        className="flex w-48 items-start justify-start p-0"
        align="start"
      >
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
                  onSelect={() => handleFilterToggle(filter.value)}
                >
                  <span>{filter.label}</span>
                  {selectedFilters.includes(filter.value) && (
                    <CheckIcon className="h-4 w-4" />
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