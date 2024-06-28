"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import { BarChartIcon, CalendarIcon, CardStackIcon, DashboardIcon, HomeIcon, PaperPlaneIcon, ReaderIcon, RocketIcon } from "@radix-ui/react-icons";

import React from "react";
import { useAuth } from "@/context/auth-provider";

export function MainNav({
  className,
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const { user, roles } = useAuth();

  const routes = [
    {
      href: `/dashboard`,
      label: "Dashboard",
      icon: DashboardIcon,
      active: pathname.match(`/dashboard`),
      role: ["hr", "admin", "user"],
      children: []
    },
    {
      href: `/my-space`,
      label: "My Space",
      icon: RocketIcon,
      active: pathname.match(`/my-space`),
      role: ["hr", "admin", "user"],
      children: []
    },
    // {
    //   href: `/leave-tracker`,
    //   label: "Leave Tracker",
    //   icon: ReaderIcon,
    //   active: pathname.match(`/leave-tracker`),
    //   role: ["admin", "hr"],
    //   children: []
    // },
    {
      href: `/organisation`,
      label: "Organisation",
      icon: HomeIcon,
      active: pathname.match(`/organisation`),
      role: ["admin", "hr"],
      children: [{
        href: `/organisation/employee`,
        label: "Employee",
        description:
          "View all your employees at one place",
      },
      {
        href: `/organisation/department`,
        label: "Department",
        description:
          "Define departments in your organisation",
      },
      {
        href: `/organisation/location`,
        label: "Locations",
        description:
          "Manage locations for your organisation",
      },
      {
        href: `/organisation/settings`,
        label: "Settings",
        description:
          "Manage organisation settings",
      }
      ]
    },
    {
      href: `/hiring`,
      label: "Hiring",
      icon: HomeIcon,
      active: pathname.match(`/hiring`),
      role: ["admin", "hr"],
      children: [{
        href: `/hiring/candidate`,
        label: "Candidate",
        description:
          "View all your candidates at one place",
      },
      {
        href: `/hiring/interview`,
        label: "Interview",
        description:
          "-",
      },
      {
        href: `/hiring/job-board`,
        label: "Job Board",
        description:
          "-",
      },
      {
        href: `/hiring/workflow`,
        label: "Workflow",
        description:
          "-",
      }
      ]
    },
    {
      href: `/attendance`,
      label: "Attendance",
      icon: CalendarIcon,
      active: pathname.match(`/attendance`),
      role: ["admin", "hr"],
      children: [
        {
          href: `/leave-tracker`,
          label: "Leave tracker",
          description:
            "Track Employee Leaves",
        },
        {
          href: `/attendance/timesheet`,
          label: "Timesheet",
          description:
            "Employee Timesheets",
        },
        {
          href: `/attendance/tracking`,
          label: "Tracking",
          description:
            "Track employee attendance",
        },
        {
          href: `/attendance/shifts`,
          label: "Shifts",
          description:
            "Manage employee shifts",
        },
        {
          href: `/attendance/adjustment`,
          label: "Adjustment",
          description:
            "Manage login time adjustments",
        }
      ]
    },
    {
      href: `/tasks`,
      label: "Tasks",
      icon: CardStackIcon,
      active: pathname.match(`/tasks`),
      role: ["admin"],
      children: []
    },
    {
      href: '/payroll',
      label: 'Payroll',
      icon: PaperPlaneIcon,
      active: pathname.match(`/payroll`),
      role: ["admin", "hr"],
      children: [
        {
          href: `/payroll`,
          label: "Payroll Runs",
          description:
            "Manage payroll runs",
        },
        {
          href: `/payroll/settings`,
          label: "Settings",
          description:
            "Manage payroll settings",
        }
      ]
    }, 
    {
      href: `/reports`,
      label: "Reports",
      icon: BarChartIcon,
      active: pathname.match(`/reports`),
      role: ["admin"],
      children: []
    }
  ];
  return (
    <NavigationMenu className="pl-8 hidden md:flex">
      <NavigationMenuList>
        {routes.map((route) => (
          route.children.length != 0 ?
            route.role.includes(roles[0]) &&
            <NavigationMenuItem key={route.href}>
              <NavigationMenuTrigger
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary gap-2",
                  route.active
                    ? "text-black dark:text-white"
                    : "text-muted-foreground"
                )}
              > {route.label}</NavigationMenuTrigger>
              <NavigationMenuContent key={route.href + 'content'}>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {route.children.map((component) => (
                    <ListItem
                      key={component.label}
                      title={component.label}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem> :
            route.role.includes(roles[0]) &&
            <NavigationMenuItem key={route.href}>
              <Link href={route.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    route.active
                      ? "text-black dark:text-white"
                      : "text-muted-foreground"
                  )}
                >
                  {route.label}
                  {/* <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">New</span> */}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
        ))}

      </NavigationMenuList>
    </NavigationMenu>
  );
}


const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}
            {/* <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">New</span> */}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>

        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
