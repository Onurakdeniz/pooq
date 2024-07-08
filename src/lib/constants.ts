import {
  ArrowUp10,
  ChevronDown,
  ClipboardCheck,
  BookA,
  SquareChevronUp,
  MessageCircleMore,
  Coins,
 
  Home,
  CircleUser,
  Check,
  AlignLeft,
  FileText,
  SearchCheck,
  Users,
  SquareArrowUpRight,
  BookmarkCheck,
  Newspaper,
} from "lucide-react";

export const UNAUTHENTICATED_PAGES = [

  "/api/register",
  "/api/trigger",
  "/_next/static",
  "/_next/image",
  "/favicon.ico",
];

export const HEADER_ITEMS = [
  { title: "Home", icon: ArrowUp10 },
  { title: "Anotherone", icon: Newspaper },
];

export const SIDE_MENU_ITEMS = [
  { title: "Home", icon: Home, href: "/" },
  { title: "Discover", icon: SearchCheck, href: "discover" },
  { title: "Invite", icon: SquareArrowUpRight, href: "#" },
  { title: "Profile", icon: CircleUser, href: "profile" },
];

export const SUGGESTION_BOX_TYPES = {
  USER: {
    title: "Suggested Followers",
    Icon: CircleUser, // Use the component directly
    info: "People you might know",
  },
  TAG: {
    title: "Suggested Tags",
    Icon: AlignLeft, // Use the component directly
    info: "Popular tags in your area",
  },

  STORY: {
    title: "Suggested Stories",
    Icon: Newspaper, // Use the component directly
    info: "Similar stories ",
  },
};

export const PROFILE_TABS = [
  { title: "Stories", icon: BookA, tooltip: "text" },
  { title: "Posts", icon: MessageCircleMore, tooltip: "text" },
  { title: "Tags", icon: FileText, tooltip: "text" },
];
