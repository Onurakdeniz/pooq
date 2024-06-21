"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDown, Filter } from "lucide-react"

const frameworks = [
  {
    value: "trending",
    label: "Trending",
  },
  {
    value: "latest",
    label: "Latest",
  },
 
]

export function FeedSort() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("trending")

  return (
    <Popover open={open} onOpenChange={setOpen} >
      <PopoverTrigger asChild>
        <div className="flex gap-2 w-20 items-center justify-end">
        <Button
          variant="link"
 
          aria-expanded={open}
          className="flex gap-2 text-xs  px-0   justify-between"
        >
         
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Filter"}

        </Button>
        <ChevronDown size="16"  />
        </div>
      </PopoverTrigger>
      <PopoverContent className="  w-36 flex border shadow-sm   p-1" align="start"  >
        <Command >
 
          <CommandList >
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {framework.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}


export default FeedSort