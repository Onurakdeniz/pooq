"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@mantine/hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SquarePen } from "lucide-react";
import WriteModal from "./write-modal";

export function PostWrite() {
  const [open, setOpen] = React.useState(false);

  const handleWrite = () => {
    setOpen((prev) => !prev);
  };
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            className=" flex gap-2 font-bold text-primary/60"
            onClick={handleWrite}
          >
            <SquarePen size="16" />
            <span>Write</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-xl bg-primary-foreground h-fit" >
          <DialogHeader>
            <DialogTitle>Write Your Idea</DialogTitle>
            <DialogDescription className="text-primary/30">
                To write directly you need to sign write action with Neynar.
            </DialogDescription>
          </DialogHeader>
          <WriteModal className=" " />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant={"outline"}
          className=" flex gap-2 font-bold text-primary/60"
          onClick={handleWrite}
        >
          <SquarePen size="16" />
          <span>Write</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Write Your Idea</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when youre done.
          </DrawerDescription>
        </DrawerHeader>
        <WriteModal className=" " />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

