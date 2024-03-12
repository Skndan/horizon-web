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
      href: `/employee-management`,
      label: "Employee Management",
      active: pathname.match(`/employee-management`),
      children: [
        {
          href: `/employee-management/directory`,
          label: "Directory",
          description:
            "View all your employees at one place",
        },
        {
          href: `/employee-management/onboarding`,
          label: "Onboarding",
          description:
            "Welcome new member to your organization",
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
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
