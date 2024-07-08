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
import { api } from "@/trpc/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
}

const FeedFilter = () => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, isLoading } = api.category.getAll.useInfiniteQuery(
    { limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const { data: searchResults, refetch: refetchSearch, isLoading: isSearchLoading } = api.category.search.useInfiniteQuery(
    { term: searchTerm, limit: 20 },
    {
      enabled: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  React.useEffect(() => {
    if (data) {
      setCategories(data.pages.flatMap(page => page.categories));
    }
  }, [data]);

  React.useEffect(() => {
    let debounceTimer: NodeJS.Timeout;

    if (searchTerm) {
      setIsSearching(true);
      debounceTimer = setTimeout(() => {
        void refetchSearch().then(() => setIsSearching(false));
      }, 300);
    } else {
      setIsSearching(false);
    }

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [searchTerm, refetchSearch]);

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

  const handleFilterToggle = (filterName: string) => {
    const isSelected = selectedFilters.includes(filterName);
    let newFilters: string[];

    if (isSelected) {
      newFilters = selectedFilters.filter(f => f !== filterName);
    } else if (selectedFilters.length >= 3) {
      toast("You can select up to 3 filters", {
        description: "Deselect an existing filter to add a new one.",
      });
      return;
    } else {
      newFilters = [...selectedFilters, filterName];
    }

    updateURL(newFilters);
    setOpen(false);
  };

  const handleSearchInput = (value: string) => {
    setSearchTerm(value);
  };

  const filtersToDisplay = searchTerm ? 
    (searchResults?.pages.flatMap(page => page.categories) ?? []) : 
    categories;

  const showSkeleton = isLoading || (searchTerm && isSearching);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex w-full items-center gap-2">
        <div className="hidden items-center gap-1 lg:flex">
          {selectedFilters.map((filterName) => (
            <Button
              className="flex h-7 items-center justify-between gap-2 px-2 text-[10px] text-primary/70"
              variant="outline"
              key={filterName}
              onClick={() => handleFilterToggle(filterName)}
            >
              <span>{filterName}</span>
              <X className="h-3 w-3" />
            </Button>
          ))}
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
          <CommandInput 
            placeholder="Search categories" 
            className="h-9"
            onValueChange={handleSearchInput}
          />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-72">
                {showSkeleton ? (
                  Array(5).fill(0).map((_, index) => (
                    <CommandItem key={index}>
                      <Skeleton className="h-4 w-full" />
                    </CommandItem>
                  ))
                ) : (
                  filtersToDisplay.map((category) => (
                    <CommandItem
                      className="flex items-center justify-between"
                      key={category.id}
                      value={category.name}
                      onSelect={() => handleFilterToggle(category.name)}
                    >
                      <span>{category.name}</span>
                      {selectedFilters.includes(category.name) && (
                        <CheckIcon className="h-4 w-4" />
                      )}
                    </CommandItem>
                  ))
                )}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FeedFilter;