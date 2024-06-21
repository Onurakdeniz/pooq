import React from "react";
import Logo from "./logo";
import Profile from "./profile";
import { HEADER_ITEMS } from "@/lib/constants";
import HeaderItem from "./item";
import SearchBar from "./search-bar";

export const Header = () => {
  return (
    <div className="flex items-center w-full justify-between h-16 border-b">
      <Logo />
      <SearchBar />
      <Profile />
    </div>
  );
};
