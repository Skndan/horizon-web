"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import React from "react";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const routes = [
    {
      href: `/dashboard`,
      label: "Dashboard",
      active: pathname.match(`/dashboard`),
      children: []
    },
    {
      href: `/organisation`,
      label: "Organisation",
      active: pathname.match(`/organisation`),
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
      href: '/payroll-management',
      label: 'Payroll Management',
      active: pathname.match(`/payroll-management`),
      children: []
    },
  ];

  return (
    <NavigationMenu className="pl-8 hidden md:flex">
      <NavigationMenuList>
        {routes.map((route) => (
          route.children.length != 0 ?
            <NavigationMenuItem key={route.href}>
              <NavigationMenuTrigger
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  route.active
                    ? "text-black dark:text-white"
                    : "text-muted-foreground"
                )}

              >{route.label}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
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
