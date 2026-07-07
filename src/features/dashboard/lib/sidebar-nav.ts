import type { LucideIcon } from "lucide-react";
import { Home, Quote, Sprout, User, Users } from "lucide-react";

export type SidebarNavId = "home" | "tree" | "groups" | "quotes" | "profile";

export type SidebarNavItem = {
  id: SidebarNavId;
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export const PRIMARY_SIDEBAR_NAV: SidebarNavItem[] = [
  { id: "home", label: "Home", href: "/dashboard", icon: Home },
  { id: "tree", label: "My Tree", href: "/dashboard", icon: Sprout },
  {
    id: "groups",
    label: "Groups",
    href: "#",
    icon: Users,
    disabled: true,
  },
  {
    id: "quotes",
    label: "Quotes",
    href: "#",
    icon: Quote,
    disabled: true,
  },
];

export const PROFILE_SIDEBAR_NAV: SidebarNavItem = {
  id: "profile",
  label: "Profile",
  href: "/profile",
  icon: User,
};

export const MOBILE_SIDEBAR_NAV: SidebarNavItem[] = [
  ...PRIMARY_SIDEBAR_NAV,
  PROFILE_SIDEBAR_NAV,
];
