// import { User } from "@prisma/client"
// import type { Icon } from "lucide-react"

import { Icons } from "@/components/ui/icons";

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type SidebarNavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
} & (
    | {
      href: string;
      items?: never;
    }
    | {
      href?: string;
      items: NavItem[];
    }
  );

export type DashboardConfig = {
  mainNav: SidebarNavItem[];
  sidebarNav: SidebarNavItem[];
};
