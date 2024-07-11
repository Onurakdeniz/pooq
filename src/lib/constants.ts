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

import {
  BookOpen,
  Lightbulb,
  Search,
  HelpCircle,
  MessageCircle,
  Calendar,
  Star,
  Zap,
  Eye,
  AlertTriangle,
  Compass,
  Radio
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

export const storyTypeIcons = {
  DEFINITION: BookOpen,
  FACTOID: Lightbulb,
  DEEP_DIVE: Search,
  QUERY: HelpCircle,
  OPINION: MessageCircle,
  EVENT: Radio,
  REVIEW: Star,
  CHALLENGE: Zap,
  OBSERVATION: Eye,
  CONFLICT: AlertTriangle,
  GUIDANCE: Compass,
};

export const storyTypeTooltips = {
  DEFINITION: "Definition: A clear explanation of a term or concept",
  FACTOID: "Factoid: A brief, interesting fact",
  DEEP_DIVE: "Deep Dive: An in-depth exploration of a topic",
  QUERY: "Query: A question or inquiry",
  OPINION: "Opinion: A personal viewpoint or perspective",
  EVENT: "Event: A notable occurrence or happening",
  REVIEW: "Review: An evaluation or assessment",
  CHALLENGE: "Challenge: A task or problem to be solved",
  OBSERVATION: "Observation: A remark or comment based on something seen",
  CONFLICT: "Conflict: A disagreement or clash of ideas",
  GUIDANCE: "Guidance: Advice or direction on a subject",
};
