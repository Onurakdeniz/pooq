import {
  ArrowUp10,
  ChevronDown,
  ClipboardCheck,
  Coins,
  Newspaper,
  Home,
  CircleUser,
  Check,
  SearchCheck,
  Users,
  SquareArrowUpRight,
  BookmarkCheck
} from "lucide-react";


export const UNAUTHENTICATED_PAGES = [
    "/login",
    "/api/register",
    "/api/trigger",
    "/_next/static",
    "/_next/image",
    "/favicon.ico",
  ];



  export const HEADER_ITEMS = [
    {title:"Home" , icon:ArrowUp10},
    {title:"Anotherone",icon:Newspaper}

  ] ;

export const SIDE_MENU_ITEMS = [
  {title:"Home" , icon:Home},
  {title:"Discover",icon:SearchCheck},
  {title:"Invite" , icon:SquareArrowUpRight},
  {title:"Bookmarks",icon:BookmarkCheck}, 
   {title:"Profile",icon:CircleUser}
]


export const SUGGESTION_BOX_TYPES = {
  FOLLOWERS: {
    title: "Suggested Followers",
    Icon: CircleUser, // Use the component directly
    info: "People you might know",
  },
  TAGS: {
    title: "Suggested Tags",
    Icon: Check, // Use the component directly
    info: "Popular tags in your area",
  },
};
 