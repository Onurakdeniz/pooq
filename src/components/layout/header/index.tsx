import React from "react";
import Logo from "./logo";
import Profile from "./profile";
import { HEADER_ITEMS } from "@/lib/constants";
import HeaderItem from "./item";
import SearchBar from "./search-bar";
import Link from "next/link";

export const Header = () => {
  return (
    <Link href={"/"}>
    <div className="flex items-center w-full justify-between h-16 border-b hover:cursor-pointer">
      <Logo />
      <SearchBar />
      <Profile />
    </div>
    </Link>
  );
};
