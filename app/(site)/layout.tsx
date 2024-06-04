"use client";

import ThemeModeToggle from "@/components/common/theme-mode-toggle";
import "../globals.css";
import Image from "next/image";
import { UserNav } from "@/components/dashboard/user-nav";
import { MainNav } from "@/components/navigation/top-menu";
import MobileNav from "@/components/navigation/top-menu-mobile";
import { CommandMenu } from "@/components/common/command-center";
import ErrorBoundary from "@/lib/error-boundary";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (

    <div className="h-full relative">
      <main>
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="flex h-16 items-center px-4">
            <MobileNav />
            <Image
              src="/horizon-light.svg"
              className="hidden dark:block pl-3"
              width="136"
              height="56"
              alt="Logo"
            />
            <Image
              src="/horizon-dark.svg"
              className="block dark:hidden pl-3"
              width="136"
              height="56"
              alt="Logo"
            />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <ThemeModeToggle />
              <UserNav />
              <CommandMenu />
            </div>
          </div>
        </header>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default RootLayout;
